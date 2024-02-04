const Command = require("../../structures/Command");
const married = require("../../database/models/family/married.js");

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "mary",
      aliases: [],
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      const significantother =
        message.mentions.users.first()?.id || message.author.id;
      const newmarried = new married({
        mariedId: significantother,
        userID: message.author.id,
        serverId: message.guild.id,
      });
      const existingdata = await married.findOne({ userID: message.author.id });

      if (existingdata) {
        return message.channel.send("You are aleady married!");
      }
      await newmarried.save();
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
