const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");

function checkDays(date) {
  let now = new Date();
  let diff = now.getTime() - date.getTime();
  let days = Math.floor(diff / 86400000);
  return days + (days == 1 ? " day" : " days") + " ago";
}

module.exports = {
  data: new SlashCommandBuilder()
  .setName("serverinfo")
  .setDescription("Displays information about the current server."),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

        const embed = new MessageEmbed()
    .setAuthor({
      name: interaction.guild.name,
      iconURL: interaction.guild.iconURL
    })
    .addFields(
      { name: `${language.nameS}`, value: `${interaction.guild.name}`, inline: true },
  { name: "ID", value: `${interaction.guild.id}`, inline: true },
      { name: `${language.sercerInfo1}`, value: `${interaction.guild.members.cache.size} | ${interaction.guild.members.cache.filter((member) => !member.user.bot).size} | ${interaction.guild.members.cache.filter((member) => member.user.bot).size}`, inline: true },
      { name: `${language.verificationLevel}`, value: `${interaction.guild.verificationLevel}`, inline: true },
      { name: `${language.channels}`, value: `${interaction.guild.channels.cache.size}`, inline: true },
      { name: `${language.roleCount}`, value: `${interaction.guild.roles.cache.size}`, inline: true },
      { name: `Created At`, value: `${interaction.channel.guild.createdAt.toUTCString().substr(0, 16)} **(${checkDays(interaction.channel.guild.createdAt)})**`, inline: true },
    )
    .setThumbnail(interaction.guild.iconURL())
    .setColor(interaction.guild.me.displayHexColor);
    interaction.reply({ embeds: [embed] });
  }
};