const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("helo")
  .setDescription("Says hello to eYuM"),
  async execute(interaction) {
    interaction.reply({
      embeds: [
        new MessageEmbed()
        .setDescription(`helo <@690288007638548522> <:TrollHappy:1058938513946591292>`)
        .setColor("BLURPLE")
      ],
    });
  }
};