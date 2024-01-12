// Imports lol
require("dotenv").config();
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const PogyClient = require("./Pogy");
const config = require("./config.json");
const deploy = require("./src/deployCommands.js");
const path = require("node:path");
const { Collection } = require("discord.js");
const logger = require("./src/utils/logger");
const fs = require("node:fs");
const Pogy = new PogyClient(config);
let messageCreateEventFired = false;

const color = require("./src/data/colors");
const Guild = require("./src/database/schemas/Guild");
const { stripIndent } = require("common-tags");
const emojis = require("./src/assets/emojis.json");

Pogy.color = color;

const emoji = require("./src/data/emoji");
Pogy.emoji = emoji;

let client = Pogy;
const jointocreate = require("./src/structures/jointocreate");
jointocreate(client);
// end imports

// Load user data from the JSON file
const userData = require("./src/data/users.json");

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  } else {
    const guildId = message.guild?.id; // Safely get guild ID using optional chaining

    if (!guildId) {
      console.error("Guild ID is undefined");
      return;
    }

    // Ensure userData.guilds is defined
    if (!userData.guilds) {
      userData.guilds = {};
    }

    let delay =
      userData.guilds[guildId]?.users[message.author.id]?.messageTimeout;

    // Check if delay is undefined or greater than or equal to Date.now() + 60
    if (delay === undefined || delay >= Date.now() + 60) {
      const userId = `${message.author.id}`;
      // Ensure userData.guilds[guildId] is defined
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
          messageTimeout: Date.now() - 60000, // Set the initial messageTimeout to 1 minute ago
          username: message.author.username,
        };
      }

      if (!userData.guilds[guildId].users[userId].background) {
        userData.guilds[guildId].users[userId].background =
          "https://img.freepik.com/premium-photo/abstract-blue-black-gradient-plain-studio-background_570543-8893.jpg"; // Replace with your default background URL
      }

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

        const levelbed = new MessageEmbed()
          .setColor(color.blue)
          .setTitle("Level Up!")
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL()
          )
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
      }

      // Save updated data back to the JSON file
      fs.writeFile(
        "./src/data/users.json",
        JSON.stringify(userData, null, 2),
        (err) => {
          if (err) console.error("Error writing file:", err);
        });
    } else {
      return;
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'levelup') {
    await interaction.reply('Button clicked!');
  }
});

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
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
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
  .setTitle('More Info')
  .setURL("https://pogy.xyz/invite")
  .setDescription("Pogy is a discord bot with a lot of features. You can invite Pogy to your server by clicking the button below")
  .setFooter("Pogy", "https://pogy.xyz/assets/images/pogy.png")
  .addField("Invite Pogy", "https://pogy.xyz/invite")
  .addField("Support Server", "https://discord.gg/pogy")
  .addField("Vote Pogy", "https://top.gg/bot/880243836830652958/vote");

const invitebutton = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setLabel("Invite Pogy")
      .setStyle("LINK")
      .setURL("https://pogy.xyz/invite"),
  );

const infobutton = new MessageEmbed()
  .setTitle(`Info`)
  .setDescription(" hello there poger. If you want more info on this bot you can check out the github repo or join the support server")
  .setURL("https://github.com/hotsu0p/Pogy/")
  .addField("Github Repo", "https://github.com/hotsu0p/Pogy/");

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  try {
    if (interaction.customId === 'support') {
      await interaction.reply({ embeds: [moreinfo], components: [invitebutton] });
    } else if (interaction.customId === 'info') {
      await interaction.reply({ embeds: [infobutton] });
    } else {
      await interaction.reply('Unknown button clicked.');
    }
  } catch (error) {
    console.error('Error handling button interaction:', error);
    await interaction.reply({ content: 'An error occurred.', ephemeral: true });
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