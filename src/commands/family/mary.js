const Command = require("../../structures/Command");
const married = require("../../database/models/family/married.js");
const { sign } = require("crypto");

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
        const significantOther = message.mentions.users.first();
if (!significantOther) {
 return message.channel.send("Please mention a user to marry.");
}

const newmarried = new married({
 mariedId: significantOther.id,
 userID: message.author.id,
 serverId: message.guild.id,
 mariedAvatar: significantOther.displayAvatarURL({ dynamic: true }),
 userAvatar: message.author.displayAvatarURL({ dynamic: true }),
 username: significantOther.username, 
});
      await newmarried.save();
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
