const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "beg",
      description: "Beg for money",
      category: "Economy",
      cooldown: 3,
    })
  }
  async run(message) {
    const amount = Math.floor(Math.random() * 2000);
    const profile = await Profile.findOne({ userID: message.author.id, guildId: message.guild.id });
    if (!profile) {
      await createProfile(message.author, message.guild);
      await message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(`Creating profile.\nUse this command again to beg for money.`)
        ]
      });
    } else {
      if (!profile.lastBeg) {
        await Profile.updateOne(
          {
            userID: message.author.id,
  guildId: message.guild.id
          },
          { $set: { lastBeg: Date.now() } }
        );
        await Profile.updateOne({ userID: message.author.id, guildId: message.guild.id })
        await message.channel.sendCustomn({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${message.author.username}'s Beg`)
            .setDescription(`You have begged ($${amount}).\nCome back in 3 minutes to beg again.`)
          ]
        });
      } else if (Date.now() - profile.lastBeg > 180000) {
        await Profile.updateOne(
          { userID: message.author.id, guildId: message.guild.id },
          { $set: { lastBeg: Date.now() } }
        );
        await Profile.updateOne({ userID: message.author.id, guildId: message.guild.id }, { $inc: { wallet: amount } });
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${message.author.username}'s Beg`)
            .setDescription(`You begged for a total of $${amount}.`)
          ]
        });
      } else {
        const lastBeg = new Date(profile.lastBeg);
        const timeLeft = Math.round((lastBeg.getTime() + 180000 - Date.now()) / 1000);
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft - minutes * 60;
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${message.author.username}'s Beg`)
            .setDescription(`You have to wait ${minutes}m ${seconds}s before you can beg again!`)
          ]
        });
      }
    }
  }
};
