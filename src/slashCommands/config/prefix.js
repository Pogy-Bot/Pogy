const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("setprefix")
  .setDescription("Set's the new prefix")
  .addStringOption((option) => option.setName("prefix").setDescription("The new prefix to set").setRequired(true)),
  async execute(interaction) {
    const settings = await Guild.findOne(
      {
        guildId: interaction.guild.id,
      },
      (err) => {
        if (err) console.log(err);
      }
    );

    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const pre = interaction.options.getString("prefix");

    if(!pre[0]) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
    .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} ${language.setPrefixMissingArgument}`),
        ],
      });
    }

    if (pre[0].length > 5) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | ${language.setPrefixLongLength}`),
        ],
      });
    }

    interaction.reply({
      embeds: [
        new MessageEmbed()
        .setColor(interaction.client.color.green)
        .setDescription(`${interaction.client.emoji.success} ${language.setPrefixChange.replace(
          "{prefix}", pre
        )}`),
      ],
    });
    await settings.updateOne({
      prefix: pre,
    });
  }
};