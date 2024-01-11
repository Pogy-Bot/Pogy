const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("uptime")
  .setDescription("Sends Pogy's uptime!"),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);
    let uptime = interaction.client.uptime;
    if (uptime instanceof Array) {
      uptime = uptime.reduce((max, cur) => Math.max(max, cur), - Infinity);
    }
    let seconds = uptime / 1000;
    let weeks = parseInt(seconds / 604800);
    seconds = seconds % 604800;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);
    uptime = `${seconds}s`;
    if (weeks) {
      uptime = `${weeks} weeks, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else if (days) {
      uptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else if (hours) {
      uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else if (minutes) {
      uptime = `${minutes} minutes, ${seconds} seconds`;
    } else if (seconds) {
      uptime = `${seconds} seconds`;
    }
    // const date = moment().subtract(days, 'ms').format('dddd, MMMM Do YYYY');
    const embed = new MessageEmbed()
    .setDescription(`${language.uptime1} \`${uptime}\`.`)
    .setFooter({ text: `https://Pogy.ml` })
    .setColor(interaction.guild.me.displayHexColor);
    interaction.reply({ embeds: [embed] });
  }
};