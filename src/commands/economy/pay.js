const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile");
const { createProfile } = require("../../utils/utils.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "pay",
            description: "Pay a user some money from your wallet",
            category: "Economy",
            usage: "pay <user> <amount>",
            examples: "pay @Peter 500",
            cooldown: 5,
        });
    }
    async run(message, args) {
        const user = message.mentions.members.first();
        const amount = args.slice(1).join("");
        const profile = await Profile.findOne({ userID: message.author.id, guildId: message.guild.id });
        if(!profile) {
            await createProfile(message.author, message.guild);
            await message.channel.sendCustom({
                embeds: [
                    new MessageEmbed()
                    .setColor("BLURPLE")
                    .setDescription(`Creating profile.\nUse this command again to use it.`)
                ]
            });
        } else {
            if(!user) {
                message.channel.sendCustom({
                    embeds: [
                        new MessageEmbed()
                        .setColor(message.client.color.red)
                        .setDescription(`Who do I pay?`)
                    ]
                });
            } else if(user.id == message.author.id) {
                message.channel.sendCustom({
                    embeds: [
                        new MessageEmbed()
                        .setColor(message.client.color.red)
                        .setDescription(`You can't pay yourself!`)
                    ]
                });
            } else {
                await Profile.updateOne({
                    userID: message.author.id, guildId: message.guild.id
                }, { $inc: { wallet: -amount } });
                await Profile.updateOne({
                    userID: user.id, guildId: message.guild.id
                }, { $inc: { wallet: amount } });
                await message.channel.sendCustom({
                    embeds: [
                        new MessageEmbed()
                        .setColor(message.client.color.green)
                        .setDescription(`You payed $${amount} to ${user}.`)
                    ]
                });
            }
        }
    }
};