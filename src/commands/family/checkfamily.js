const Command = require("../../structures/Command");
const married = require("../../database/models/family/married.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "checkmaried", 
      aliases: [], 
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
   
    });
  }

  async run(message) {
    try {
      // grab data from the db 
      const marriedData = await married.findOne({serverId: message.guild.id , userID: message.author.id});
      // console log the data
    message.channel.send(JSON.stringify(marriedData));
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};