const Command = require("../../structures/Command");
const { saveGuild } = require('channelsave-discord');


// Add any additional dependencies or modules as needed

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "save", // Replace with your command name
      aliases: [], // Add any aliases for your command
      description: "Empty command template.",
      category: "General", // Adjust the category as needed
      cooldown: 5,
      // Add any other command options or configurations
    });
  }

  async run(message) {
    try {
     
      
      await saveGuild(message.guild, '/home/vboxuser/Pogy-3/src/data/guild_information.json');
      message.channel.send("done!");
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
