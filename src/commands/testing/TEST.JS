// GuildInfoCommand.js
const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class GuildInfoCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "guildinfo",
      aliases: ["serverinfo"],
      description: "Fetch information about the guild.",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
    
    } catch (error) {
      console.error("Error in guildinfo command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};