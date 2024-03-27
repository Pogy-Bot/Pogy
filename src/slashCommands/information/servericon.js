const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("servericon")
  .setDescription("Display's the icon of the current server"),
  async execute(interaction) {
    const embed = new MessageEmbed()
    .setAuthor(`${interaction.guild.name}'s Server Icon`, interaction.guild.iconURL({ dynamic: true, size: 512 }))
    .setImage(interaction.guild.iconURL({ dynamic: true, size: 512 }))
    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()
    .setColor(interaction.guild.me.displayHexColor)
    interaction.reply({ embeds: [embed] });
  }
};