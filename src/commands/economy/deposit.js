const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "deposit",
      aliases: ["dep"],
      description: "Deposit your wallet money to the bank.",
      category: "Economy",
      usage: "<amount>",
      examples: ["dep 400"],
      cooldown: 3,
    })
  }
  async run(message, args) {
    const profile = await Profile.findOne({ userID: message.author.id, guildId: message.guild.id });
    if (!profile) {
      await createProfile(message.author, message.guild);
      await message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
          .setColor("BLURPLE")
          .setDescription(`Creating profile.\nUse this command again to deposit your money.`)
        ]
      });
    } else {
      const amount = args[0];
      if (amount > profile.wallet) {
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`You don't have enough money to deposit!`)
          ]
        });
      } else {
        await Profile.updateOne({
          userID: message.author.id, guildId: message.guild.id
        },
        { $inc: { wallet: -amount, bank: amount } });
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`Deposited $${amount} to the bank.`)
          ]
        });
      }
    }
  }
};