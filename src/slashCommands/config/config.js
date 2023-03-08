const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("settings")
  .setDescription("Show's the current settings for this guild"),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);
    await interaction.reply({
      embeds: [
        new MessageEmbed()
        .setColor(interaction.guild.me.displayHexColor)
        .setTitle(`${language.serversettings1}`)
        .addFields(
          { name: `Main Settings`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id})`, inline: true },
          { name: `Welcome & Leave`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/welcome)`, inline: true },
          { name: `Logging`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/logging)`, inline: true },
          { name: `Autorole`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/autorole)`, inline: true },
          { name: `Alt Detector`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/altdetector)`, inline: true },
           { name: `Tickets`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/tickets)`, inline: true },
          { name: `Suggestions`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/suggestions)`, inline: true },
          { name: `Server Reports`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/reports)`, inline: true },
          { name: `Automod`, value: `[\`Click here\`](https://mee8.ml/dashboard/${interaction.guild.id}/automod)`, inline: true }
        )
        .setFooter({ text: `${interaction.guild.name}` }),
      ],
    });
  }
};