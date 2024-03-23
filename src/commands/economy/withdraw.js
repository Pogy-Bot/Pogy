const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "withdraw",
      aliases: ["with"],
      description: "Withdraw your bank money from the bank to your wallet.",
      category: "Economy",
      usage: "<amount>",
      examples: ["withdraw 400"],
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
          .setDescription(`Creating profile.\nUse this command again to withdraw your money.`)
        ]
      });
    } else {
      const amount = args[0];
      if (amount > profile.bank) {
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`You don't have enough money to withdraw!`)
          ]
        });
      } else {
        await Profile.updateOne({
          userID: message.author.id, guildId: message.guild.id
        },
        { $inc: { wallet: amount, bank: -amount } });
        await message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`Withdrawn $${amount} from the bank.`)
          ]
        });
      }
    }
  }
};