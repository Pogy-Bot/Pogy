const { createLogger, format, transports } = require("winston");
const { combine, printf } = format;
const Discord = require("discord.js");
const config = require("../../config.json");
const webhookClient = new Discord.WebhookClient({
  url: config.webhooks.logs,
});
const chalk = require("chalk");

const myFormat = printf(({ level, message, label, timestamp }) => {
  webhookClient.send(`${timestamp} [${label}] ${message}`);
  return `${timestamp} [${level}] [${chalk.cyan(label)}] ${message}`;
});

const myCustomLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
};

const logger = createLogger({
  levels: myCustomLevels.levels,
  format: combine(
    format.colorize(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./src/assets/logs/Pogy.log" }),
  ],
});

module.exports = logger;
