const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("m")
  .setDescription("Sends the letter m"),
  async execute(interaction) {
    interaction.reply({ content: "m." });
  }
};