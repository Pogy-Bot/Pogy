const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils.js");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "rob",
            description: "Rob someone!",
            category: "Economy",
            usage: "<user>",
            examples: "rob @Peter"
        })
    }
    async run(message, args) {
        const user = message.mentions.members.first();
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
            if (user.id == message.author.id) {
                await message.channel.sendCustom({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`hey stupid, seems pretty dumb to steal from urself`)
                    ]
                })
            } else if (!profile.lastRobbed) {
                await Profile.updateOne(
                    { userID: message.author.id, guildId: message.guild.id }, { $set: { lastRobbed: Date.now() } }
                );
                let amount = Math.floor(Math.random() * profile.wallet);
                await Profile.updateOne({
                    userID: user.id,
                    guildId: message.guild.id,
                }, { $inc: { wallet: -amount }});
                await Profile.updateOne({
                    userID: message.author.id,
                    guildId: message.guild.id,
                }, { $inc: { wallet: amount } });

                await message.channel.sendCustom({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`Successfully robbed ${user} for $${amount}.`)
                        .setColor(this.client.color.green)
                        .setTimestamp()
                    ]
                })
            } else if (Date.now - profile.lastRobbed > 600000) {
                await Profile.updateOne(
                    { userID: message.author.id, guildId: message.guild.id }, { $set: { lastRobbed: Date.now() } }
                );
                let amount = Math.floor(Math.random() * profile.wallet);
                await Profile.updateOne({
                    userID: user.id,
                    guildId: message.guild.id,
                }, { $inc: { wallet: -amount }});
                await Profile.updateOne({
                    userID: message.author.id,
                    guildId: message.guild.id,
                }, { $inc: { wallet: amount } });

                await message.channel.sendCustom({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`Successfully robbed ${user} for $${amount}.`)
                        .setColor(this.client.color.green)
                        .setTimestamp()
                    ]
                })
            } else {
                const lastRobbed = new Date(profile.lastRobbed);
                const timeLeft = Math.round((lastRobbed.getTime() + 600000 - Date.now()) / 1000);
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft - minutes * 60;
                await message.channel.sendCustom({
                    embeds: [
                        new MessageEmbed()
                        .setColor("BLURPLE")
                        .setDescription(`You have to wait ${minutes}m ${seconds}s before you can collect your monthly earnings!`)
                    ]
                })
            }
        }
    }
}