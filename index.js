require("dotenv").config();
const PogyClient = require("./Pogy"); // Required for initial bot connection
const config = require("./config.json");
const logger = require("./src/utils/logger");
const Pogy = new PogyClient(config); // Required for client login

const color = require("./src/data/colors"); // colors
Pogy.color = color;

const emoji = require("./src/data/emoji"); // emojis (make sure to add your custom emojis to this file)
Pogy.emoji = emoji;

let client = Pogy;
const jointocreate = require("./src/structures/jointocreate"); // file required to make jointocreate
jointocreate(client);

Pogy.react = new Map();
Pogy.fetchforguild = new Map();

Pogy.start(process.env.TOKEN); // NEEDED FOR BOT LOGIN, SHOULD NEVER BE REMOVED OR EDITED

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


