const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const send = require(`../../packages/logs/index.js`);

module.exports = {
  data: new SlashCommandBuilder()
  .setName("say")
  .setDescription("Make the bot say something")
  .addStringOption((option) => option.setName("message").setDescription("The message to say").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const text = interaction.options.getString("message")

    if(!text) {
      return interaction.reply({ content: `${language.whatdoIsay}` });
    }

    interaction.reply({ content: text })
    .catch(() => {})
  }
}