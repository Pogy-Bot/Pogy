const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("f")
  .setDescription("Pay your respects.")
    .addUserOption((option) => option.setName("member").setDescription("The member (this is optional)")),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const target = interaction.options.getMember("member")

    if(!target) {
      const embed = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag} has paid their respects.`,
        iconURL: interaction.member.displayAvatarURL({ format: "png" })
      })
      .setColor("PURPLE")
      .setFooter({ text: `${language.f3}` });
      const message = await interaction.reply({ content: ' ', embeds: [embed], fetchReply: true });
      message.react("🇫")
    } else {
    const embed = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag} has paid their respects.`,
        iconURL: interaction.member.displayAvatarURL({ format: "png" })
      })
      .setColor("PURPLE")
      .setDescription(`${interaction.user.tag} ${language.f2} ${target}`)
      .setFooter({ text: `${language.f3}` });
      const message = await interaction.reply({ content: ' ', embeds: [embed], fetchReply: true });
      message.react("🇫")
    }
  }
};
