const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");
const Guild = require("../../database/schemas/Guild");
const { stripIndent } = require("common-tags");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Return the ping of the bot."),
    async execute(interaction) {
        const guildDB = await Guild.findOne({
            guildId: interaction.guild.id,
        });
        const client = interaction.client
        const language = require(`../../data/language/${guildDB.language}.json`)
        const embed = new MessageEmbed()
        .setDescription(`Pinging...`)
        .setColor(client.color.red)
        .setFooter({ text: `Powered by https://mee8.ml/` });

        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

        const vowel = [
            "a",
            "e",
            "i",
            "u",
            "u"
        ];

        const latency = msg.createdTimestamp - interaction.createdTimestamp;

        let koko = stripIndent`
        **${language.timeTaken}** \`${latency}ms\`
        **${language.discordAPI}** \`${Math.round(client.ws.ping)}ms\`
        `;

        let color = interaction.guild.me.displayHexColor;
        if (latency < 100) {
            color = `#00ff00`;
        } else if (latency > 100 && latency < 200) {
            color = `#CCCC00`
        } else if (latency > 200) {
            color = interaction.client.color.red;
        } else color = interaction.guild.me.displayHexColor;

        embed.setDescription(`P${vowel[Math.floor(Math.random() * vowel.length)]}ng\n${koko}`);
        embed.setColor(color);
        interaction.editReply({ embeds: [embed] });
    },
};