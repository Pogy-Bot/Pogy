const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "addmoney",
      aliases: ["add"],
      description: "Add money to a users wallet!",
      category: "Economy",
      usage: "<user> <amount>",
      examples: ["addmoney @Peter 400"],
      cooldown: 3,
    })
  }
  async run(message, args) {
    const user = message.mentions.members.first();
    const amount = args.slice(1).join("");
    const profile = await Profile.findOne({ userID: user.id, guildId: message.guild.id });
    if (!profile) {
      await createProfile(user, message.guild);
      await message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(`Creating profile.\nUse this command again to use it.`)
        ]
      });
    } else {
      await Profile.updateOne({
        userID: message.author.id, guildId: message.guild.id
      },
      { $inc: { wallet: amount} });
      await message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(`Added $${amount} to ${user}`)
        ]
      });
    }
  }
};