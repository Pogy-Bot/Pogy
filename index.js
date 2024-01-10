require("dotenv").config();
const PogyClient = require("./Pogy");
const config = require("./config.json");
const deploy = require("./src/deployCommands.js");
const path = require("node:path");
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

<<<<<<< HEAD
function wait(seconds) {
  const waitTime = seconds * 1000;
  return new Promise(resolve => {
    setTimeout(resolve, waitTime);
  })
}

// Load user data from the JSON file
const userData = require("./src/data/users.json");

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const guildId = message.guild.id;

  // Check if the guild exists in userData, if not, initialize it
  if (!userData.guilds[guildId]) {
    userData.guilds[guildId] = {
      users: {},
    };
  }

  if (!userData.guilds[guildId].users[userId]) {
    userData.guilds[guildId].users[userId] = {
      xp: 0,
      level: 1,
    };
  }

  // Increment XP for the user in the specific guild
  userData.guilds[guildId].users[userId].xp += Math.floor(Math.random() * 15) + 10;

  const nextLevelXP = userData.guilds[guildId].users[userId].level * 75;

  // Check for level-up logic
  const xpNeededForNextLevel = userData.guilds[guildId].users[userId].level * nextLevelXP;
  if (userData.guilds[guildId].users[userId].xp >= xpNeededForNextLevel) {
    userData.guilds[guildId].users[userId].level += 1;
    message.channel.send(
      `${message.author.username} has leveled up to level ${userData.guilds[guildId].users[userId].level}!`,
    );
  }

  // Save updated data back to the JSON file
  fs.writeFile(
    "./src/data/users.json",
    JSON.stringify(userData, null, 2),
    (err) => {
      if (err) console.error("Error writing file:", err);
    },
  );
});


=======
// Load user data from the JSON file
let userData = require('./src/data/users.json');

client.on('messageCreate', message => {
  if (message.author.bot) return;

  const userId = message.author.id;
  if (!userData.users[userId]) {
    userData.users[userId] = {
      xp: 0,
      level: 1
    };
  }

  // Increment XP for the user
  userData.users[userId].xp += 1;

  // Check for level-up logic
  const xpNeededForNextLevel = userData.users[userId].level * 75;
  if (userData.users[userId].xp >= xpNeededForNextLevel) {
    userData.users[userId].level += 1;
    message.channel.send(`${message.author.username} has leveled up to level ${userData.users[userId].level}!`);
  }

  // Save updated data back to the JSON file
  fs.writeFile('./src/data/users.json', JSON.stringify(userData, null, 2), err => {
    if (err) console.error('Error writing file:', err);
  });
});
>>>>>>> 1fb43df5c22729642c114bf11fa5beaf5d965ff1
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 1fb43df5c22729642c114bf11fa5beaf5d965ff1
