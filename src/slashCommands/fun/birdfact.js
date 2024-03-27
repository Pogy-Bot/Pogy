const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("birdfact")
  .setDescription("Generate random bird facts"),
  async execute(interaction) {
    const res = await fetch("https://some-random-api.ml/facts/bird").catch(() => {});

    const fact = (await res.json()).fact;

    if (!res) {
      return interaction.reply({ content: `The API is currectly down, come back later!`, ephemeral: true });
    }
    interaction.reply({
      embeds: [
        new MessageEmbed()
        .setColor(interaction.client.color.blue)
        .setDescription(`${fact}`)
        .setFooter({ text: "/some-random-api/bird" }),
      ],
    });
  }
};