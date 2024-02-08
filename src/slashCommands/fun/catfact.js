const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("catfact")
  .setDescription("Generate random cat facts"),
  async execute(interaction) {
    const res = await fetch("https://catfact.ninja/fact").catch(() => {})
    const fact = (await res.json()).fact;
    const embed = new MessageEmbed()
    .setDescription(`${fact}`)
    .setFooter({ text: `/catfact.ninja/fact` })
    .setTimestamp()
    .setColor(interaction.client.color.blue);
    interaction.reply({ embeds: [embed] }).catch(() => {});
  }
};