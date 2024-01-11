const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "daily",
      description: "Collect daily earnings. 24hr cooldown.",
      category: "Economy",
      cooldown: 3,
    })
  }
  async run(message) {
    const profile = await Profile.findOne({ guildId: message.guild.id, userID: message.author.id });
    if (!profile) {
      await createProfile(message.author, message.guild);
      await message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(`Creating profile.\nUse this command again to collect your daily earnings.`)
        ]
      });
    } else {
      if (!profile.lastDaily) {
        await Profile.updateOne(
          {
            userID: message.author.id, guildId: message.guild.id
          }, 
          { $set: { lastDaily: Date.now() } }
        );
        await Profile.updateOne({ userID: message.author.id, guildId: message.guild.id })
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${message.author.username}'s Daily`)
            .setDescription(`You have collected todays earnings ($50000).\nCome back tommorow to collect more.`)
          ]
        });
      } else if (Date.now() - profile.lastDaily > 86400000) {
        await Profile.updateOne(
          { userID: message.author.id, guildId: message.guild.id },
          { $set: { lastDaily: Date.now() } }
        );
        await Profile.updateOne({ userID: message.author.id, guildId: message.guild.id }, { $inc: { wallet: 50000 } });
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${message.author.username}'s Daily`)
            .setDescription(`You have collected your daily earnings of $50000.`)
          ]
        });
      } else {
        const lastDaily = new Date(profile.lastDaily);
        const timeLeft = Math.round((lastDaily.getTime() + 86400000 - Date.now()) / 1000);
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft - hours * 3600) / 60);
        const seconds = timeLeft - hours * 3600 - minutes * 60;
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setTitle(`${message.author.username}'s Daily`)
            .setDescription(`You have to wait ${hours}h ${minutes}m ${seconds}s before you can collect your daily earnings!`)
          ]
        });
      }
    }
  }
};