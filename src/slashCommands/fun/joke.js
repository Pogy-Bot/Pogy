const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Generate a random joke from jokeAPI"),
  async execute(interaction) {
    const data = await fetch(
      `https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist`
    ).then((res) => res.json());

    if (!data)
      return interaction.reply({ content: `Sorry, seems like I can't connect to JokeAPI.`, ephemeral: true });

        const { type, category, joke, setup, delivery } = data;

    interaction.reply({
      embeds: [
        new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`${category} joke`)
        .setDescription(`${type === "twopart" ? `${setup}\n\n||${delivery}||` : joke}`),
      ],
    });
  }
};