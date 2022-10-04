const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const darkpassword = require("generate-password");
const Logging = require("../../database/schemas/logging");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: "modnick",
            aliases: ["mod", "modnickname"],
            description: "Moderate a users nickname to make pinging possible",
            category: "Moderation",
            guildOnly: true,
            botPermission: ["MANAGE_NICKNAMES"],
            userPermission: ["MANAGE_NICKNAMES"],
            usage: "<@user> [reason]",
            examples: "modnick @Peter Please make sure your nickname have characters that are typeable on a standard QWERTY keyboard",
            cooldown: 30,
        });
    }

    async run(message, args) {
        const client = message.client
        const logging = await Logging.findOne({ guildId: message.guild.id });

        const member = 
        message.mentions.members.last() ||
        message.guild.members.cache.get(args[0]);

        const reason = args.slice(1).join(" ");

        const impostorpassword = darkpassword.generate({
            length: 6,
            numbers: true,
        });

        //LOGGING HERE
        if (logging) {
            if (logging.moderation.delete_after_executed === "true") {
                message.delete().catch(() => {});
            }
        }

        if(!args[0]) {
            let validmention = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emoji.fail} | Please mention a valid member!`)
            return message.channel.sendCustom({ embeds: [validmention] })
        }

        if(!member) {
            let usernotfound = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emoji.fail} | I can't find that member`)
            return message.channel.sendCustom({ embeds: [usernotfound] })
        }

        if(member.roles.highest.position >= message.member.roles.highest.position) {
            let rolesmatch = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emoji.fail} | They have more power than you or have equal power as you do!`)
            return message.channel.sendCustom({ embeds: [rolesmatch] })
        }

        if(member.id === message.author.id) {
            let modnickerror = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emoji.fail} | You can't moderate your own nickname!`)
            return message.channel.sendCustom({ embeds: [modnickerror] })
        }

        if(member) {
            const oldNickname = member.nickname || "None";
            await member.setNickname(`Moderated Nickname ${impostorpassword}`)
            let embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`${client.emoji.success} | Moderated <@${member.id}>'s nickname for \`${reason || "No Reason Provided"}\``)

            message.channel.sendCustom({ embeds: [embed] })
        } else {
            return message.reply(`I can't moderate their nickname, make sure that my role is above theirs`)
        }
        return undefined
    }
};