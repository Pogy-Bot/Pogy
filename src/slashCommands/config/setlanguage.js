const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("setlanguage")
  .setDescription("Set a guild language")
  .addStringOption((option) => option.setName("language").setDescription("The language to set").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    let languages = ["english", "french", "spanish", "arabic", "polish"];

    const e = interaction.options.getString("language");

    if (!e) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | ${language.setLangMissingArgument}`),
        ],
      });
    }

    let setLangInvalidOption = language.setLangInvalidOption.replace("{languages}", languages.join(", "));
    if (!languages.includes(e.toLowerCase()))
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | ${setLangInvalidOption}`),
        ],
      });

    let setLangChange = language.setLangChange.replace("{language}", e.toLowerCase());
    interaction.reply({
      embeds: [
        new MessageEmbed()
        .setColor(interaction.client.color.green)
        .setDescription(`${interaction.client.emoji.success} | ${setLangChange}`),
      ],
    });

    await guildDB.updateOne({ language: e.toLowerCase() });
  }
};