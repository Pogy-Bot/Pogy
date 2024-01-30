const Command = require("../../structures/Command");


module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "partners", 
      aliases: [], 
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
   
    });
  }

  async run(message) {
    try {
     
      message.channel.send("eres.fun");
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};