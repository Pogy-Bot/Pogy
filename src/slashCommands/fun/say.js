const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const send = require(`../../packages/logs/index.js`);

module.exports = {
  data: new SlashCommandBuilder()
  .setName("say")
  .setDescription("Make the bot say something")
  .addStringOption((option) => option.setName("message").setDescription("The message to say").setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString("message")

    interaction.reply({ content: text })
    .catch(() => {})
  }
}