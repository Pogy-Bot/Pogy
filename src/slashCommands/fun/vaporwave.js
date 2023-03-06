const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("vaporwave")
  .setDescription("Vaporwave a text")
  .addStringOption((option) => option.setName("message").setDescription("The message").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const vaporwave = interaction.options.getString("message")

    const vaporwavefield = vaporwave.toString().split("").map((char) => {
      const code = char.charCodeAt(0);
      return code >= 33 && code <= 126
      ? String.fromCharCode(code - 33 + 65281)
        :
        char;
    })
    .join("")
    .replace(/, /g, "  ");
    interaction.reply({ 
      embeds: [
        new MessageEmbed()
        .setDescription(vaporwavefield)
        .setColor(interaction.client.color.blue),
      ],
    });
  }
};
