
const Command = require("../../structures/Command");

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "passwordgen", 
      aliases: ["passgen"], 
      description: "Generate a random password", 
      category: "Fun", 
      cooldown: 3,
      
    });
  }

  async run(message) {
    try {
        const { passGen } = require('spicycord');
        const password = passGen(20) 
      message.channel.send(`Your password is: ${password}`);
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
