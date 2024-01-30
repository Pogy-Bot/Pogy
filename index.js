// Imports lol
require("dotenv").config();
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const PogyClient = require("./Pogy");
const config = require("./config.json");
const axios = require("axios");
const { Collection } = require("discord.js");
const logger = require("./src/utils/logger");
const fs = require("node:fs");
const Pogy = new PogyClient(config);

const color = require("./src/data/colors");
Pogy.color = color;

const emoji = require("./src/data/emoji");
Pogy.emoji = emoji;

let client = Pogy;
const jointocreate = require("./src/structures/jointocreate");
jointocreate(client);
// end imports
const userData = require("./src/data/users.json");
// getPlayerData function with base64 encoding
// Load user data from the JSON file

// This assumes you have a function getGuildConfig defined in your levelUtils
client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  } else {
    let delay =
      userData.guilds[message.guild.id].users[message.author.id].messageTimeout;
    if (delay >= Date.now() + 60000) {
      if (message.author.bot) return;

      const userId = message.author.id;
      const guildId = message.guild.id;

      // Check if the guild exists in userData, if not, initialize it
      if (!userData.guilds[guildId]) {
        userData.guilds[guildId] = {
          users: {},
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

      //if(!userData.guilds[guildId].users[userId].messageTimeout)

      // Increment XP for the user in the specific guild
      userData.guilds[guildId].users[userId].xp +=
        Math.floor(Math.random() * 15) + 10;

      let nextLevelXP = userData.guilds[guildId].users[userId].level * 75;

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
            `You have reached level ${userData.guilds[guildId].users[userId].level}!`,
          )
          .setFooter(
            `XP: ${userData.guilds[guildId].users[userId].xp}/${xpNeededForNextLevel}`,
          );

        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("levelup")
            .setLabel("Level Up")
            .setStyle("SUCCESS"),
        );
        message.channel.send({
          embeds: [levelbed],
          components: [row],
        });

        // Save updated data back to the JSON file
        fs.writeFile(userData, JSON.stringify(userData, null, 2), (err) => {
          if (err) console.error("Error writing user data file:", err);
        });
      }
    }
  }
});

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

client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  try {
    const userID = message.author.id;
    const serverID = message.guild.id;

    // Fetch the user's advancements from the database
    let userAdvancements = await Advancement.findOne({
      userID,
      serverID,
    });

    if (!userAdvancements) {
      userAdvancements = await Advancement.create({
        userID,
        serverID,
        advancements: [],
        messageCount: 0,
      });
    }

    // Increment the message count for the user
    userAdvancements.messageCount = (userAdvancements.messageCount || 0) + 1;

    // Check if the user reached 20 messages
    if (
      userAdvancements.messageCount >= 20 &&
      !userAdvancements.advancements.includes("MessageMaster")
    ) {
      console.log(`User ${userID} reached 20 messages.`); // Debug message

      // Add the new advancement
      userAdvancements.advancements.push("MessageMaster");

      // Notify the user about the new advancement in the channel
      message.channel.send(
        `Congratulations, ${message.author}! You have earned the 'MessageMaster' advancement for reaching 20 messages!`,
      );

      // Reset the message count

      // Save the updated advancements to the database
      await userAdvancements.save();
    }
    if (
      userAdvancements.messageCount >= 100 &&
      !userAdvancements.advancements.includes("Active chatter")
    ) {
      console.log(`User ${userID} reached 100 messages.`);

      // Add the new advancement
      userAdvancements.advancements.push("Active chatter");

      // Notify the user about the new advancement in the channel
      message.channel.send(
        `Congratulations, ${message.author}! You have earned the 'Active chatter' advancement for reaching 100 messages!`,
      );

      // Reset the message count

      // Save the updated advancements to the database
      await userAdvancements.save();
    }
  } catch (error) {
    console.error(error);
  }
});

// mem leak fix
client.setMaxListeners(20);

/* 
  This is where you should add all button handler stuff
  this is the first one i have added
*/
const moreinfo = new MessageEmbed()
  .setColor(color.blue)
  .setTitle("More Info")
  .setURL("https://394wkx-3000.csb.app//invite")
  .setDescription(
    "Chaoticis a discord bot with a lot of features. You can invite Pogy to your server by clicking the button below",
  )
  .setFooter("Pogy", "https://394wkx-3000.csb.app//assets/images/pogy.png")
  .addField("Invite Pogy", "https://394wkx-3000.csb.app//invite")
  .addField("Support Server", "https://discord.gg/pogy")
  .addField("Vote Pogy", "https://top.gg/bot/880243836830652958/vote");

const levelupbutton = new MessageEmbed()
  .setColor(color.blue)
  .setTitle("Level Up")
  .setFooter("Pogy", "https://394wkx-3000.csb.app//assets/images/pogy.png")
  .setDescription(
    `Hm this doesnt seem to do much. But you can click it anyways`,
  )
  .setURL("https://394wkx-3000.csb.app//invite");

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
      await interaction.reply("Unknown button clicked.");
    }
  } catch (error) {
    console.error("Error handling button interaction:", error);
    await interaction.reply({ content: "An error occurred.", ephemeral: true });
  }
});

const { EmojiBackup } = require("discord.emoji-backup");
const backup = new EmojiBackup();
client.on("message", async (msg) => {
  if (msg.author.bot || !msg.guild) return;
  if (!msg.content.startsWith("!")) return;
  const args = msg.content.slice("!".length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === "create") {
    // Create a backup
    await backup.create(msg.guild).then(console.log);
  }
  if (command === "load-nodelete") {
    // Load a backup without deleting all emojis
    const backupid = args.join(" ");
    await backup.load(msg.guild, backupid);
  }
  if (command === "load-delete") {
    // Load a backup with deleting all emojis
    const backupid = args.join(" ");
    await backup.load(msg.guild, backupid, { deleteAll: true });
  }
  if (command === "list") {
    // List all of backups
    const list = await backup.list();
    console.log(list);
    msg.channel.send(`\`\`\`js\n${JSON.stringify(list, null, 2)}\`\`\``);
  }
});
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
