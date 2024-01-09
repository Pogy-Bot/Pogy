const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("dogfact")
  .setDescription("Generate a random dog fact"),
  async execute(interaction) {
    const res = await fetch("https://dogapi.dog/api/facts");
    const fact = (await res.json()).facts[0];

    const embed = new MessageEmbed()
    .setDescription(`${fact}`)
    .setFooter({ text: `/dog-api.kinduff/api/fact` })
    .setTimestamp()
    .setColor(interaction.client.color.blue);
    interaction.reply({ embeds: [embed] }).catch(() => {});
  }
};