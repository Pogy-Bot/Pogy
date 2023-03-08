const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const Logging = require("../../database/schemas/logging");
const { execute } = require("./kick");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a person in the server!")
    .addStringOption((option) => option.setName("member").setDescription("Person who you want to unban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for the unban")),
    async execute(interaction) {
        const client = interaction.client
        const logging = Logging.findOne({
            guildId: interaction.guild.id
        });
        if(!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.followUp({ content: "You do not have permission to use this command." });

        const user = interaction.options.getString("member")
        const reason = interaction.options.getString("reason") || "No reason provided"

        const totalbans = await interaction.guild.bans.fetch()

        const userToUnabn = totalbans.find(x => x.user.id || x.user.username || x.user.tag)

        await interaction.guild.bans.remove(userToUnabn.user.id).then(() => {
            let unbansuccess = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${client.emoji.success} | ${user} has been unbanned. __**Reason:**__ ${reason}`)
            return interaction.reply({ embeds: [unbansuccess] })
            .then(async () => {
                if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                        interaction.deleteReply().catch(() => {})
                    }, 5000);
                }
            })
            .catch(() => {}).then(() => {
            let dmEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`You have unbanned in **${interaction.guild.name}**.\n\n__**Moderator:**__ ${interaction.author} **(${interaction.author.tag})**\n__**Reason:**__ ${reason}`)
            user.send({ embeds: [dmEmbed] });
            })
        })
    },
};