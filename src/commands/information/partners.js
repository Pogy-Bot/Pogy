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
     
      message.channel.send("A multipurpose discord client written in javascript featuring a lot of util commands and a highly optimized web application with control over the application's settings. Eres is used on over 30 servers, we invite you to try it out and hope you enjoy!\n\n\nLinks:\n https://eres.fun/ \n https://eres.fun/invite \n https://eres.fun/support");
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};