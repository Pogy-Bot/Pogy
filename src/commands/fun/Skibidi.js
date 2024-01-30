const { Interaction } = require("discord.js");
const Command = require("../../structures/Command");


module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "skibidi", 
      aliases: [], 
      description: "why...",
      category: "Fun",
      cooldown: 5,
   
    });
  }

  async run(message) {
    try {
      const member = await message.guild.members.fetch(message.author.id); // Fetch the Member object
      const timeoutDuration = 1000 * 60 ; // 10 minutes in milliseconds

      try {
        await member.timeout(timeoutDuration, "Wow your a skibdi");
        message.channel.send("Wow, you're a skibidi");
      } catch (error) {
        console.error("Error timing out member:", error);
        message.channel.send(
          "An error occurred timing out the member. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};