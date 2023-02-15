const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "balance",
      aliases: ["bal"],
      description: "Check a user's balance",
      category: "Economy",
      usage: "[user]",
      examples: ["balance", "balance @Peter"],
      cooldown: 3,
    })
  }
  async run(message, args) {
    const user = message.mentions.members.first() || message.author;

    const profile = await Profile.findOne({
      userID: user.id,
      guildId: message.guild.id
    });
    if (!profile) {
      if(user.id !== message.author.id) return message.channel.sendCustom(`${user} doesn't have a profile!`);
      
      await createProfile(user, message.guild);
      await message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(`Creating profile.\nUse this command again to check your balance.`)
        ]
      });
    } else {
      await message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
          .setColor("BLURPLE")
          .setTitle(`${user.username}'s Balance`)
          .setDescription(`**Wallet:** $${profile.wallet}\n**Bank:** $${profile.bank}`)
        ]
      });
    }
  }
};
