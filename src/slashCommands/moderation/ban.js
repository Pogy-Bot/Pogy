const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a person in the server!")
    .addUserOption((option) => option.setName("member").setDescription("Person who you want to ban.").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason of the ban")),
    async execute(interaction) {
        const client = interaction.client;
        const logging = await Logging.findOne({
            guildId: interaction.guild.id,
        });
        if(!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.followUp({ content: "You do not have permission to use this command." });

        const member = interaction.options.getMember("member")
        const reason = interaction.options.getString("reason") || "No reason provided"

        if(!member) {
            let usernotfound = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emoji.fail} | I can't find that member`)
            return interaction.reply({ embeds: [usernotfound] })
            .then(async () => {
                if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                        interaction.deleteReply().catch(() => {});
                    }, 5000);
                }
            })
            .catch(() => {});
        }

        if(member.roles.highest.position >= interaction.member.roles.highest.position) {
            let rolesmatch = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emoji.fail} | They have more power than you or have equal power as you do!`)
            return interaction.reply({ embeds: [rolesmatch] })
            .then(async () => {
                if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                        interaction.deleteReply().catch(() => {});
                    }, 5000)
                }
            })
            .catch(() => {});
        }
        if(member === interaction.author) {
            let banerror = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${client.emoji.fail} | You can't ban yourself!`)
            return interaction.reply({ embeds: [banerror] })
            .then(async () => {
                if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                        interaction.deleteReply().catch(() => {})
                    }, 5000)
                }
            })
            .catch(() => {})
        }

        if(member) {
            const response = await member.ban({ reason })
            let bansuccess = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${client.emoji.success} | ${member} has been banned. __**Reason:**__ ${reason || "No reason Provided"}`)
            return interaction.reply({ embeds: [bansuccess] })
            .then(async () => {
                if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                        interaction.deleteReply().catch(() => {})
                    }, 5000)
                }
            })
            .catch(() => {})
        }
        if(member) {
            let dmEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`You have been banned in **${interaction.guild.name}**.\n\n__**Moderator:**__ ${interaction.author} **(${interaction.author.tag})**\n__**Reason:**__ ${reason || "No Reason Provided"}`)
            .setTimestamp()
            member.send({ embeds: [dmEmbed] })
        } else {
            let failembed = new MessageEmbed()
            .setColor(client.color.red)
            .setDescription(`${client.emoji.fail} | I cannot ban that member. Make sure my role is above their role or that I have sufficient perms to execute the command.`)
            .setTimestamp()
            return interaction.reply({ embeds: [failembed] })
        }
    },
};