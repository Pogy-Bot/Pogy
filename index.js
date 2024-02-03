// Imports lol

const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const PogyClient = require("./Pogy");
const config = require("./config.json");
const axios = require("axios");
const { Collection } = require("discord.js");
const logger = require("./src/utils/logger");
const fs = require("node:fs");
const Pogy = new PogyClient(config);
const path = require("path");
const color = require("./src/data/colors");
const Guild = require("./src/database/schemas/Guild");
const { stripIndent } = require("common-tags");
const emojis = require("./src/assets/emojis.json");
const jointocreate = require("./src/structures/jointocreate");
const emoji = require("./src/data/emoji");
const userData = require("./src/data/users.json");
// lets
let client = Pogy;
// pogy stuff
jointocreate(client);
Pogy.color = color;
Pogy.emoji = emoji;
// reqs
require("dotenv").config();


client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  const guildId = message.guild?.id;

  if (!guildId) {
    console.error("Guild ID is undefined");
    return;
  }

  const guildConfig = getGuildConfig(guildId);
  const userId = message.author.id;

  // Load user data from file
  const userDataPath = "./src/data/users.json";
  let userData = {};
  try {
    const userDataFileContent = fs.readFileSync(userDataPath, "utf-8");
    userData = JSON.parse(userDataFileContent);
  } catch (error) {
    console.error("Error reading user data file:", error);
  }

  // Ensure userData.guilds is defined
  if (!userData.guilds) {
    userData.guilds = {};
  }

  // Ensure userData.guilds[guildId] is defined
  if (!userData.guilds[guildId]) {
    userData.guilds[guildId] = {
      users: {},
      levelingEnabled: true,
    };
  }

  // Ensure userData.guilds[guildId].users[userId] is defined
  if (!userData.guilds[guildId].users[userId]) {
    userData.guilds[guildId].users[userId] = {
      xp: 0,
      level: 1,
      messageTimeout: Date.now(),
      username: message.author.username,
    };
  }

      if (!userData.guilds[guildId].users[userId].background) {
        userData.guilds[guildId].users[userId].background =
          "https://img.freepik.com/premium-photo/abstract-blue-black-gradient-plain-studio-background_570543-8893.jpg"; // Replace with your default background URL
      }

      if (!userData.guilds[guildId].users[userId].messageTimeout) {
        userData.guilds[guildId].users[userId].messageTimeout = Date.now();
      }

  // Increment XP for the user in the specific guild
  userData.guilds[guildId].users[userId].xp +=
    Math.floor(Math.random() * 15) + 10;

  let nextLevelXP = userData.guilds[guildId].users[userId].level * 75;
      userData.guilds[guildId].users[userId].messageTimeout = Date.now();

  // Check for level-up logic
  let xpNeededForNextLevel =
    userData.guilds[guildId].users[userId].level * nextLevelXP;

  if (userData.guilds[guildId].users[userId].xp >= xpNeededForNextLevel) {
    userData.guilds[guildId].users[userId].level += 1;
    nextLevelXP = userData.guilds[guildId].users[userId].level * 75;
    xpNeededForNextLevel =
      userData.guilds[guildId].users[userId].level * nextLevelXP;

        // Get the role ID for the current user's level
        const roleForLevel = getRoleForLevel(
          userData.guilds[guildId].users[userId].level,
          guildId,
          userId,
          userData,
        );

    // Add the role to the user if a valid role ID is found
    if (roleForLevel) {
      const member = message.guild.members.cache.get(userId);
      const role = message.guild.roles.cache.get(roleForLevel);
      if (member && role) {
        await member.roles.add(role);
      }
    }

    const levelbed = new MessageEmbed()
      .setColor("#3498db")
      .setTitle("Level Up!")
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setDescription(
        `You have reached level ${userData.guilds[guildId].users[userId].level}!`
      )
      .setFooter(
        `XP: ${userData.guilds[guildId].users[userId].xp}/${xpNeededForNextLevel}`
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("levelup")
        .setLabel("Level Up")
        .setStyle("SUCCESS")
    );
    message.channel.send({
      embeds: [levelbed],
      components: [row],
    });

    // Save updated data back to the JSON file
    fs.writeFile(
      userDataPath,
      JSON.stringify(userData, null, 2),
      (err) => {
        if (err) console.error("Error writing user data file:", err);
      }
    );
  }
});

// Function to get guild configuration, create if not exists
function getGuildConfig(guildId) {
  if (!userData.guilds[guildId]) {
    userData.guilds[guildId] = {
      users: {},
      levelingEnabled: true, // Add a new property to enable/disable leveling
    };
  }
  return userData.guilds[guildId];
}

// Function to get role ID for the current user's level
function getRoleForLevel(level, guildId, userId, userData) {
  if (!userData.guilds[guildId]?.users[userId]) {
    return null;
  }

  const { levelUpRoles } = userData.guilds[guildId];

  if (!levelUpRoles) {
    return null;
  }

  // Find the role ID for the current user's level
  const roleForLevel = levelUpRoles.find((role) => role.level === level);

  // If roleForLevel is found, return its roleId; otherwise, use the default mapping
  return roleForLevel?.roleId || getRoleIdForLevel(level, guildId, userData);
}

// Default role ID mapping (replace with your actual role IDs)
function getRoleIdForLevel(level, guildId, userData) {
  // Retrieve role IDs from the JSON file based on the guild and level
  const guildRoles = userData.guilds[guildId]?.levelUpRoles || {};
  return guildRoles[level]?.roleId || null;
}

client.slashCommands = new Collection();
const commandsFolders = fs.readdirSync("./src/slashCommands");

for (const folder of commandsFolders) {
  const commandFiles = fs
    .readdirSync(`./src/slashCommands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const slashCommand = require(`./src/slashCommands/${folder}/${file}`);
    client.slashCommands.set(slashCommand.data.name, slashCommand);
    Promise.resolve(slashCommand);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const slashCommand = client.slashCommands.get(interaction.commandName);

  if (!slashCommand) return;

  try {
    await slashCommand.execute(interaction);
  } catch (error) {
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});
const Advancement = require("./src/database/models/advancement.js");

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  await setupSticky(message);

  // Your other messageCreate logic here...
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'addstickyvalues') {
      // Command to add or update values in the JSON file
      await addStickyValues(interaction);
  } else if (commandName === 'updatestickymessage') {
      // Command to update the content of the sticky message
      await updateStickyMessage(interaction);
  }
});

async function setupSticky(msg) {
  const guildId = msg.guild.id;

  // Create the stickyData directory if it doesn't exist
  const dataDir = './stickyData';
  if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
  }

  // Load or initialize the sticky messages from the JSON file
  const filePath = path.join(dataDir, `${guildId}.json`);
  let stickyData = {};

  if (fs.existsSync(filePath)) {
      stickyData = JSON.parse(fs.readFileSync(filePath));
  } else {
      fs.writeFileSync(filePath, JSON.stringify(stickyData));
  }

  // Check if the message is from the desired channel
  const stickyChannelId = stickyData.stickyChannelId || '1200072567055192075'; // Default channel ID
  const stickyMessageContent = stickyData.stickyMessageContent || 'This is a sticky message!';

  if (msg.channel.id === stickyChannelId) {
      // Get the current sticky message for this channel
      const currentStickyMessageId = stickyData.stickyMessageId;

      // If there's no sticky message yet, send one and store its ID
      if (!currentStickyMessageId) {
          const newStickyMessage = await msg.channel.send(stickyMessageContent);
          stickyData.stickyMessageId = newStickyMessage.id;
          saveStickyData(guildId, stickyData);
      } else {
          // If there's already a sticky message, delete it and send a new one
          const stickyMessage = await msg.channel.messages.fetch(currentStickyMessageId);
          if (stickyMessage) {
              await stickyMessage.delete();
          }
          const newStickyMessage = await msg.channel.send(stickyMessageContent);
          stickyData.stickyMessageId = newStickyMessage.id;
          saveStickyData(guildId, stickyData);
      }
  }
}

async function addStickyValues(interaction) {
  const guildId = interaction.guild.id;

  const stickyChannelId = interaction.options.getString('channelid');
  const stickyMessageContent = interaction.options.getString('messagecontent');

  // Load or initialize the sticky messages from the JSON file
  const filePath = path.join('./stickyData', `${guildId}.json`);
  let stickyData = {};

  if (fs.existsSync(filePath)) {
      stickyData = JSON.parse(fs.readFileSync(filePath));
  }

  // Add or update values in the JSON file
  stickyData.stickyChannelId = stickyChannelId;
  stickyData.stickyMessageContent = stickyMessageContent;
  saveStickyData(guildId, stickyData);

  await interaction.reply('Sticky values have been added or updated!');
}

async function updateStickyMessage(interaction) {
  const guildId = interaction.guild.id;

  // Load or initialize the sticky messages from the JSON file
  const filePath = path.join('./stickyData', `${guildId}.json`);
  let stickyData = {};

  if (fs.existsSync(filePath)) {
      stickyData = JSON.parse(fs.readFileSync(filePath));
  }

  const newStickyMessageContent = interaction.options.getString('newmessagecontent');

  // Check if there's a current sticky message ID
  const currentStickyMessageId = stickyData.stickyMessageId;
  if (currentStickyMessageId) {
      // Fetch the current sticky message and update its content
      const currentStickyMessage = await interaction.channel.messages.fetch(currentStickyMessageId);
      if (currentStickyMessage) {
          await currentStickyMessage.edit(newStickyMessageContent);
          stickyData.stickyMessageContent = newStickyMessageContent;
          saveStickyData(guildId, stickyData);
          await interaction.reply('Sticky message content has been updated!');
      } else {
          await interaction.reply('Error: Unable to fetch the current sticky message.');
      }
  } else {
      await interaction.reply('Error: No current sticky message found.');
  }
}

function saveStickyData(guildId, data) {
  const filePath = path.join('./stickyData', `${guildId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data));
}


// mem leak fix
client.setMaxListeners(20);

/* 
  This is where you should add all button handler stuff
  this is the first one i have added
*/
const moreinfo = new MessageEmbed()
  .setColor(color.blue)
  .setTitle("More Info")
  .setURL("https://pogy.xyz/invite")
  .setDescription(
    "Chaoticis a discord bot with a lot of features. You can invite Pogy to your server by clicking the button below",
  )
  .setFooter("Pogy", "https://pogy.xyz/assets/images/pogy.png")
  .addField("Invite Pogy", "https://pogy.xyz/invite")
  .addField("Support Server", "https://discord.gg/pogy")
  .addField("Vote Pogy", "https://top.gg/bot/880243836830652958/vote");

const levelupbutton = new MessageEmbed()
  .setColor(color.blue)
  .setTitle("Level Up")
  .setFooter("Pogy", "https://pogy.xyz/assets/images/pogy.png")
  .setDescription(
    `Hm this doesnt seem to do much. But you can click it anyways`,
  )
  .setURL("https://pogy.xyz/invite");

const invitebutton = new MessageActionRow().addComponents(
  new MessageButton()
    .setLabel("Invite Pogy")
    .setStyle("LINK")
    .setURL("https://394wkx-3000.csb.app//invite"),
);

const infobutton = new MessageEmbed()
  .setTitle(`Info`)
  .setDescription(
    " hello there poger. If you want more info on this bot you can check out the github repo or join the support server",
  )
  .setURL("https://github.com/hotsu0p/Pogy/")
  .addField("Github Repo", "https://github.com/hotsu0p/Pogy/");

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isButton()) return;

    if (interaction.customId === "support") {
      await interaction.reply({
        embeds: [moreinfo],
        components: [invitebutton],
      });
    } else if (interaction.customId === "info") {
      await interaction.reply({ embeds: [infobutton] });
    } else if (interaction.customId === "levelup") {
      await interaction.reply({ embeds: [levelupbutton] });
    } else if (interaction.customId === "rerole") {
      // Handle rerole button click
      const members = interaction.guild.members.cache;
      const newRandomUser = members.random();

      const newEmbed = new MessageEmbed()
        .setTitle("New Random User")
        .setDescription(`**User:** <@${newRandomUser.user.id}>`)
        .setColor("RANDOM")
        .setFooter(`Requested by ${interaction.user.username}`);

      await interaction.update({ embeds: [newEmbed] });
    } else if (
      interaction.customId === "rock" ||
      interaction.customId === "paper" ||
      interaction.customId === "scissors"
    ) {
      // Rock, paper, scissors game logic
      const userChoice = interaction.customId;
      const botChoice = ["rock", "paper", "scissors"][
        Math.floor(Math.random() * 3)
      ];

      const emojis = {
        rock: "✊",
        paper: "✋",
        scissors: "✌️",
      };

      const resultEmbed = new MessageEmbed()
        .setColor("#00FF00")
        .setTitle("Rock Paper Scissors")
        .setDescription(
          `You chose ${emojis[userChoice]}, and the bot chose ${emojis[botChoice]}.`,
        );

      let resultMessage;
      if (userChoice === botChoice) {
        resultMessage = "It's a tie!";
        resultEmbed.setColor("#FFFF00");
      } else {
        const userWins =
          (userChoice === "rock" && botChoice === "scissors") ||
          (userChoice === "paper" && botChoice === "rock") ||
          (userChoice === "scissors" && botChoice === "paper");
        resultMessage = userWins ? "You win!" : "You lose!";
        resultEmbed.addField(
          "Result",
          `${resultMessage} ${emojis[userChoice]} beats ${emojis[botChoice]}`,
        );
        if (userWins) {
          resultEmbed.setColor("#00FF00");
        } else {
          resultEmbed.setColor("#FF0000");
        }
      }

      const playAgainButton = new MessageButton()
        .setCustomId("playagain")
        .setLabel("Play Again")
        .setStyle("PRIMARY");

      const buttonRow = new MessageActionRow().addComponents(playAgainButton);

      await interaction.reply({
        embeds: [resultEmbed],
        components: [buttonRow],
      });
    } else if (interaction.customId === "playagain") {
      // Start a new game
      const gameEmbed = new MessageEmbed()
        .setColor("#0080FF")
        .setTitle("Rock Paper Scissors")
        .setDescription("Choose your move!");

      const rockButton = new MessageButton()
        .setCustomId("rock")
        .setLabel("Rock")
        .setEmoji("✊")
        .setStyle("SUCCESS");

      const paperButton = new MessageButton()
        .setCustomId("paper")
        .setLabel("Paper")
        .setEmoji("✋")
        .setStyle("SUCCESS");

      const scissorsButton = new MessageButton()
        .setCustomId("scissors")
        .setLabel("Scissors")
        .setEmoji("✌️")
        .setStyle("SUCCESS");

      const buttonRow = new MessageActionRow().addComponents(
        rockButton,
        paperButton,
        scissorsButton,
      );

      await interaction.update({
        embeds: [gameEmbed],
        components: [buttonRow],
      });
    } else {
      return; // this makes it so that it stop annoying you with unknow buttons
    }
  } catch (error) {
    console.error("Error handling button interaction:", error);
    await interaction.reply({ content: "An error occurred.", ephemeral: true });
  }
});

const { debounce } = require('lodash'); // Import debounce function for button handling


// Define emojis for blocks
const blockEmojis = {
    'I': '🟩',
    'O': '🟨',
    // Add more blocks and emojis as needed
};


// Define all possible Tetrominos
const tetrominos = [
    [
        [1, 1, 1, 1]
    ], // I
    [
        [1, 1],
        [1, 1]
    ], // O
    [
        [1, 1, 1],
        [0, 1, 0]
    ], // S
    [
        [0, 1, 1],
        [1, 1]
    ], // Z
    [
        [1, 1, 0],
        [0, 1, 1]
    ], // T
    [
        [1, 1, 1, 1, 1]
    ], // J
    [
        [1, 1, 1, 1, 1]
    ], // L
];

function generateRandomTetromino() {
    return tetrominos[Math.floor(Math.random() * tetrominos.length)];
}

let gameState = {
    tetrominoRow: 0,
    tetrominoCol: 0,
    tetromino: generateRandomTetromino(), // Now the function is defined
    board: Array.from({ length: 20 }, () => Array(10).fill('⬛')),
};

let gameInterval; // Variable to store the interval for automatic falling

client.once('ready', () => {
    console.log('Bot is ready');
});

client.on('messageCreate', async(message) => {
    if (message.content.toLowerCase() === '!starttetris') {
        await startTetrisGame(message);
    }
});
function renderBoard(board) {
    return board.map((row) => row.map((block) => blockEmojis[block] || block).join(' ')).join('\n');
}

async function startTetrisGame(message) {
    gameState.board = Array.from({ length: 20 }, () => Array(10).fill('⬛'));
    gameState.tetrominoCol = Math.floor(gameState.board[0].length / 2) - 2;
    const renderedBoard = renderBoard(gameState.board);
    const buttonMessage = await message.channel.send(`${renderedBoard}\n\nPress the buttons below to move the Tetromino!`);

    // Create buttons
    const buttons = [
        new MessageButton().setCustomId('left').setLabel('Move Left').setStyle('PRIMARY'),
        new MessageButton().setCustomId('right').setLabel('Move Right').setStyle('SECONDARY'),
        new MessageButton().setCustomId('rotate').setLabel('Rotate').setStyle('DANGER'),
        new MessageButton().setCustomId('harddrop').setLabel('Hard Drop').setStyle('SUCCESS'),
    ];

    // Send the message with the buttons
    const row = new MessageActionRow().addComponents(buttons);
    await buttonMessage.edit({ components: [row] });

    // Start the automatic falling interval
    gameInterval = setInterval(async() => {
        await moveDown(gameState, buttonMessage);
    }, 1000); // Change the interval as needed

    // Add your logic to handle the Tetris game and reactions here
    client.on('interactionCreate', async(interaction) => {
        try {
            if (!interaction.isButton()) return;

            // Debounce button interactions to avoid excessive calls (adjust delay as needed)
            const debouncedHandleInteraction = debounce(async() => {
                console.log(`Clicked ${interaction.customId} from ${interaction.user.username}`);
                if (interaction.user.id === message.author.id) {
                    switch (interaction.customId) {
                        case 'left':
                            await moveLeft(gameState, buttonMessage);
                            await handleInteractionReply(interaction, 'Moved left');
                            break;
                        case 'right':
                            await moveRight(gameState, buttonMessage);
                            await handleInteractionReply(interaction, 'Moved right');
                            await message.reply(`Clicked ${interaction.customId}`)
                            break;
                        case 'rotate':
                            await rotate(gameState, buttonMessage);
                            await handleInteractionReply(interaction, 'Rotated');
                            break;
                        case 'harddrop':
                            await hardDrop(gameState, buttonMessage);
                            await handleInteractionReply(interaction, 'Hard dropped');
                            break;
                        default:
                            break;
                    }
                }
            }, 100); // Debounce delay of 100ms

            debouncedHandleInteraction();
        } catch (error) {
            console.error('Error handling interaction:', error);
            // Display an error message in the chat
            await interaction.reply('An error occurred while processing your request.');
        }
    });

    async function handleInteractionReply(interaction, content) {
        try {
            // Check if the original message is still available
            const originalMessage = await interaction.fetchReply();

            // If the original message is not found, do not reply
            if (!originalMessage) {
                console.log('Original message not found. Ignoring interaction.');
                return;
            }

            // Reply to the interaction
            await interaction.reply({
                content,
                ephemeral: true, // Set to true if you want the reply to be visible only to the user who clicked the button
            });
        } catch (error) {
            console.error('Error replying to interaction:', error);
        }
    }

    function generateRandomTetromino() {
        return tetrominos[Math.floor(Math.random() * tetrominos.length)];
    }
    async function hardDrop(gameState, buttonMessage) {
        clearInterval(gameInterval); // Stop automatic falling

        // Calculate the lowest possible row for the hard drop
        const lowestRow = getLowestPossibleRow(gameState);

        // Set the tetromino row to the calculated lowest row
        gameState.tetrominoRow = lowestRow;

        // Merge, send new tetromino, clear rows, etc.
        mergeTetrominoIntoBoard(gameState);
        sendNewTetromino(gameState);
        clearCompleteRows(gameState, buttonMessage);

        // Update the board one last time before restarting automatic falling
        await updateBoard(gameState, buttonMessage);

        gameInterval = setInterval(async() => {
            await moveDown(gameState, buttonMessage);
        }, 1000); // Restart automatic falling
    }

    // New function to calculate the lowest possible row
    function getLowestPossibleRow(gameState) {
        let lowestRow = gameState.tetrominoRow;

        // Loop through each row down from the current position
        for (let row = lowestRow + 1; row < gameState.board.length; row++) {
            // Check if the tetromino can move down to this row without collision
            if (canMove(gameState, 'down', row)) {
                lowestRow = row;
            } else {
                // Break out of the loop if a collision is detected, stopping at the last valid row
                break;
            }
        }

        return lowestRow;
    }
    async function moveDown(gameState, buttonMessage) {
        // Move down the Tetromino
        clearTetromino(gameState);

        // Check if the Tetromino can move down
        if (canMove(gameState, 'down')) {
            gameState.tetrominoRow += 1;
        } else {
            // Tetromino reached the bottom
            // Merge the Tetromino into the board
            mergeTetrominoIntoBoard(gameState);
            sendNewTetromino(gameState);

            // Check for complete rows and clear them
            clearCompleteRows(gameState, buttonMessage);
        }

        // Place the Tetromino in its new position (or leave it merged if at the bottom)
        placeTetromino(gameState);

        // Update the board
        await updateBoard(gameState, buttonMessage);
    }

    function mergeTetrominoIntoBoard(gameState) {
        for (let row = 0; row < gameState.tetromino.length; row++) {
            for (let col = 0; col < gameState.tetromino[row].length; col++) {
                if (gameState.tetromino[row][col] !== 0) {
                    gameState.board[gameState.tetrominoRow + row][gameState.tetrominoCol + col] = 'I';
                }
            }
        }
    }

    async function clearCompleteRows(gameState, buttonMessage) {
        let rowsCleared = 0;

        for (let row = gameState.board.length - 1; row >= 0; row--) {
            if (gameState.board[row].every(block => block !== '⬛')) {
                gameState.board.splice(row, 1);
                rowsCleared++;
                gameState.board.unshift(Array(10).fill('⬛')); // Add an empty row at the top
            }
        }

        // Update score or handle game over if needed
        if (rowsCleared > 0) {
            // Update score or display a message
            await buttonMessage.edit(`${renderBoard(gameState.board)}\n\nRows cleared: ${rowsCleared}`);
        }
    }

    async function moveLeft(gameState, buttonMessage) {
        // Move left the Tetromino
        clearTetromino(gameState);

        // Check if the Tetromino can move left
        if (canMove(gameState, 'left')) {
            gameState.tetrominoCol -= 1;
        }

        // Place the Tetromino in its new position
        placeTetromino(gameState);

        // Update the board
        await updateBoard(gameState, buttonMessage);
    }

    async function moveRight(gameState, buttonMessage) {
        // Move right the Tetromino
        clearTetromino(gameState);

        // Check if the Tetromino can move right
        if (canMove(gameState, 'right')) {
            gameState.tetrominoCol += 1;
        }

        // Place the Tetromino in its new position
        placeTetromino(gameState);

        // Update the board
        await updateBoard(gameState, buttonMessage);
    }


    function rotateTetromino(tetromino, direction) {
        const rotationMatrix = direction === "clockwise" ? CLOCKWISE_ROTATION_MATRIX : COUNTERCLOCKWISE_ROTATION_MATRIX;
        const rotatedTetromino = [];

        // Apply rotation matrix to each row of the tetromino
        for (let row = 0; row < tetromino.length; row++) {
            const newRow = [];
            for (let col = 0; col < tetromino[row].length; col++) {
                const newIndex = multiplyMatrixVector(rotationMatrix, [row, col]);
                newRow.push(tetromino[newIndex[0]][newIndex[1]]);
            }
            rotatedTetromino.push(newRow);
        }

        if (canPlaceTetromino(rotatedTetromino)) {
            return rotatedTetromino;
        } else {
            return null; // Rotation failed due to collision
        }
    }

    function canPlaceTetromino(tetromino) {
        for (let row = 0; row < tetromino.length; row++) {
            for (let col = 0; col < tetromino[row].length; col++) {
                if (
                    tetromino[row][col] !== 0 &&
                    (board[row + tetrominoRow][col + tetrominoCol] === undefined ||
                        board[row + tetrominoRow][col + tetrominoCol] !== "⬛")
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    // Define clockwise and counter-clockwise rotation matrices
    const CLOCKWISE_ROTATION_MATRIX = [
        [0, 1],
        [-1, 0],
    ];

    const COUNTERCLOCKWISE_ROTATION_MATRIX = [
        [0, -1],
        [1, 0],
    ];

    function canMove(gameState, direction) {
        const newRow = gameState.tetrominoRow + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
        const newCol = gameState.tetrominoCol + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);

        for (let row = 0; row < gameState.tetromino.length; row++) {
            for (let col = 0; col < gameState.tetromino[row].length; col++) {
                if (gameState.tetromino[row][col] !== 0) {
                    const boardRow = newRow + row;
                    const boardCol = newCol + col;

                    if (
                        boardRow < 0 ||
                        boardRow >= gameState.board.length ||
                        boardCol < 0 ||
                        boardCol >= gameState.board[0].length ||
                        gameState.board[boardRow][boardCol] !== '⬛'
                    ) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function sendNewTetromino(gameState) {
        // Create a new Tetromino (you can customize this part)
        const newTetromino = generateRandomTetromino();
        gameState.tetromino = newTetromino;
        gameState.tetrominoRow = 0;
        gameState.tetrominoCol = Math.floor((gameState.board[0].length - newTetromino[0].length) / 2);
    }


    function canPlaceTetromino(gameState, tetromino) {
        // Check if the Tetromino can be placed in the new position
        for (let row = 0; row < tetromino.length; row++) {
            for (let col = 0; col < tetromino[row].length; col++) {
                if (
                    tetromino[row][col] !== 0 &&
                    (gameState.board[gameState.tetrominoRow + row] === undefined ||
                        gameState.board[gameState.tetrominoRow + row][gameState.tetrominoCol + col] !== '⬛')
                ) {
                    return false;
                }
            }
        }
        return true;
    }

    function clearTetromino(gameState) {
        // Clear the current position of the Tetromino
        for (let row = 0; row < gameState.tetromino.length; row++) {
            for (let col = 0; col < gameState.tetromino[row].length; col++) {
                if (
                    gameState.tetromino[row][col] !== 0 &&
                    gameState.board[gameState.tetrominoRow + row] &&
                    gameState.board[gameState.tetrominoRow + row][gameState.tetrominoCol + col]
                ) {
                    gameState.board[gameState.tetrominoRow + row][gameState.tetrominoCol + col] = '⬛';
                }
            }
        }
    }

    function placeTetromino(gameState) {
        // Place the Tetromino in its new position
        for (let row = 0; row < gameState.tetromino.length; row++) {
            for (let col = 0; col < gameState.tetromino[row].length; col++) {
                if (
                    gameState.tetromino[row][col] !== 0 &&
                    gameState.board[gameState.tetrominoRow + row] &&
                    gameState.board[gameState.tetrominoRow + row][gameState.tetrominoCol + col]
                ) {
                    gameState.board[gameState.tetrominoRow + row][gameState.tetrominoCol + col] = 'I';
                }
            }
        }
    }

    async function updateBoard(gameState, buttonMessage) {
        // Update the message with the new board state
        await buttonMessage.edit(`${renderBoard(gameState.board)}\n\nButtons pressed:`);
    }
}

Pogy.react = new Map();
Pogy.fetchforguild = new Map();

Pogy.start(process.env.TOKEN);

process.on("unhandledRejection", (reason, p) => {
  logger.info(`[unhandledRejection] ${reason.message}`, { label: "ERROR" });
  console.log(reason, p);
});

process.on("uncaughtException", (err, origin) => {
  logger.info(`[uncaughtException] ${err.message}`, { label: "ERROR" });
  console.log(err, origin);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  logger.info(`[uncaughtExceptionMonitor] ${err.message}`, { label: "ERROR" });
  console.log(err, origin);
});

process.on("multipleResolves", (type, promise, reason) => {
  logger.info(`[multipleResolves] MULTIPLE RESOLVES`, { label: "ERROR" });
  console.log(type, promise, reason);
});