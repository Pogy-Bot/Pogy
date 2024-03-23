const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Displays a users avatar")
  .addUserOption((option) => option.setName("member").setDescription("The user to get the avatar of").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const member = interaction.options.getMember("member");

    if (!member) member = interaction.member;

    const embed = new MessageEmbed()
    .setAuthor(
      `${language.pfpAvatar.replace("{user}", `${member.user.tag}`)}`,
      member.user.displayAvatarURL({ dynamic: true, size: 512 }),
      member.user.displayAvatarURL({ dynamic: true, size: 512 })
    )
    .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512, format: "png" }))
    .setFooter({
      text: interaction.member.displayName,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp()
    .setColor(member.displayHexColor);
    return interaction.reply({ embeds: [embed] });
  }
}