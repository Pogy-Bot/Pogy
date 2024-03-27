const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const specialCodes = {
  0: ":zero:",
  1: ":one:",
  2: ":two:",
  3: ":three:",
  4: ":four:",
  5: ":five:",
  6: ":six:",
  7: ":seven:",
  8: ":eight:",
  9: ":nine:",
  "#": ":hash:",
  "*": ":asterisk:",
  "?": ":grey_question:",
  "!": ":grey_exclamation:",
  " ": " ",
};

module.exports = {
  data: new SlashCommandBuilder()
  .setName("emojify")
  .setDescription("Emojify a text")
  .addStringOption((option) => option.setName("message").setDescription("The message to make big").setRequired(true)),
  async execute(interaction) {
    try {
      const guildDB = await Guild.findOne({
        guildId: interaction.guild.id,
      });
  
      const language = require(`../../data/language/${guildDB.language}.json`);
  
      let text = interaction.options.getString("message")
  
      if(!text) {
        return interaction.reply({ content: `${language.emojify}` });
      }
  
      const emojified = text
      .toString()
      .toLowerCase()
      .split("")
      .map((letter) => {
        if (/[a-z]/g.test(letter)) {
          return `:regional_indicator_${letter}:`;
        } else if (specialCodes[letter]) {
          return `${specialCodes[letter]}`;
        }
        return letter;
      })
      .join("")
      .replace(/,/g, " ");
  
      interaction.reply({ content: emojified }).catch(() => {
        interaction.reply({ content: `${language.emojifyError}` }).catch(() => {});
      });
    } catch {
      interaction.reply({ content: `This command cannot be used in Direct Messages.`, ephemeral: true });
    }
  }
};