const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const afk = require("../../database/models/afk.js");
const discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("afk")
  .setDescription("Set an AFK message!")
  .addStringOption((option) => option.setName("reason").setDescription("The reason to go AFK (if this is blank then the message will be 'AFK')")),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);
    const reason = interaction.options.getString("reason") || "AFK"

    const oldNickname = interaction.member.nickname || interaction.user.username;
    const nickname = `[AFK] ${oldNickname}`;

    const afklist = await afk.findOne({
      userID: interaction.user.id
    });
    if(!afklist) {
      const newafk = new afk({
        serverID: interaction.guild.id,
      userID: interaction.user.id,
        reason: reason,
        oldNickname: oldNickname,
        time: Date.now()
      });

      await interaction.member.setNickname(nickname).catch(() => {});

      const embed = new discord.MessageEmbed()
      .setDescription(`${language.afk5} ${reason}`)
      .setColor(interaction.client.color.blurple)
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });
      interaction.reply({ embeds: [embed] });
      newafk.save().catch((err) => console.error(err));
    }
  }
};