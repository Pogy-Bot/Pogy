const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/MEE8");
const Guildd = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.suppressDeprecationWarnings = true;

module.exports = {
  data: new SlashCommandBuilder()
  .setName("news")
  .setDescription("Shows MEE8's latest news"),
  async execute(interaction) {
    const guildDB = await Guild.findOne({});

    const guildDB2 = await Guildd.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB2.language}.json`);

    if (!guildDB) return interaction.reply({ content: `${language.noNews}`, ephemeral: true });

    let embed = new MessageEmbed()
    .setColor(interaction.guild.me.displayHexColor)
    .setTitle(`MEE8 News`)
    .setDescription(`***__${language.datePublished}__ ${moment(guildDB.time).format("dddd, MMMM Do YYYY")}*** *__[\`(${moment(guildDB.time).fromNow()})\`] (https://mee8.ml)__*\n\n${guildDB.news}`)
    .setFooter({ text: "https://mee8.ml" })
    .setTimestamp();
    interaction.reply({ embeds: [embed] }).catch(() => {
      interaction.reply({ content: `${language.noNews}`, ephemeral: true });
    });
  }
};