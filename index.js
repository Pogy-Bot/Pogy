require("dotenv").config();
const PogyClient = require("./Pogy");
const config = require("./config.json");
const logger = require("./src/utils/logger");
const Pogy = new PogyClient(config);

const color = require("./src/data/colors");
Pogy.color = color;

const emoji = require("./src/data/emoji");
Pogy.emoji = emoji;

let client = Pogy;
const jointocreate = require("./src/structures/jointocreate");
jointocreate(client);
const fs = require('fs');

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


