// EmptyCommand.js
const Command = require("../../structures/Command");
// Add any additional dependencies or modules as needed
const { loadGuild } = require('channelsave-discord'); // Replace with your actual package name

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "load", // Replace with your command name
      aliases: [], // Add any aliases for your command
      description: "load channels",
      category: "General", // Adjust the category as needed
      cooldown: 5,
      // Add any other command options or configurations
    });
  }

  async run(message) {
    try {
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        await loadGuild(message.guild, '/home/vboxuser/Pogy-3/src/data/guild_information.json');
        message.channel.send("Done!");
      } else {
        return message.channel.send("You do not have permission to use this command.");
      }
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
}
