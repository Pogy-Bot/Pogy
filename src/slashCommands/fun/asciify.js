const { SlashCommandBuilder } = require("@discordjs/builders");
const figlet = require("util").promisify(require("figlet"));
const Guild = require("../../database/schemas/Guild");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("asciify")
  .setDescription("Asciify a text")
  .addStringOption((option) => option.setName("text").setDescription("The text to asciify").setRequired(true)),
  async execute(interaction) {
    try {
      const guildDB = await Guild.findOne({
        guildId: interaction.guild.id
      });
  
      const language = require(`../../data/language/${guildDB.language}.json`);
  
      const text = interaction.options.getString("text");
  
      if (text.length < 1) {
        return interaction.reply({ content: `${interaction.client.emoji.fail} ${language.changeErrorValid}` });
      }
  
      return interaction.reply(await figlet(text), { code: true })
      .catch(() => {
        interaction.reply(`${language.bigError}`)
      });
    } catch {
      interaction.reply({ content: `This command cannot be used in Direct Messages.`, ephemeral: true });
    }
  }
};