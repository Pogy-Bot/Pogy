const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("unlock")
  .setDescription("Unlocks a channel in the server")
  .addChannelOption((option) => option.setName("channel").setDescription("The channel to unlock").setRequired(true))
  .addStringOption((option) => option.setName("reason").setDescription("The reason to unlock the channel")),
  async execute(interaction) {
    const client = interaction.client;
    const fail = interaction.client.emoji.fail;
    const success = interaction.client.emoji.success;

    const logging = await Logging.findOne({ guildId: interaction.guild.id });
    const guildDB = await Guild.findOne({ guildId: interaction.guild.id });
    const language = require(`../../data/language/${guildDB.language}.json`);
    let channel = interaction.options.getChannel("channel");
    let reason = interaction.options.getString("reason");

    let member = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === "member");
    let memberr = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === "members");
    let verified = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === "verified");
    if(channel) {
      reason = reason || "`none`";
    } else channel = interaction.channel;

    if(channel.permissionsFor(interaction.guild.id).has("SEND_MESSAGES") === true) {
      const lockchannelError2 = new MessageEmbed()
      .setDescription(`${fail} | ${channel} is already unlocked`)
      .setColor(client.color.red)
      return interaction.reply({ embeds: [lockchannelError2], ephemeral: true });
    }

    channel.permissionOverwrites.edit(interaction.guild.me, { SEND_MESSAGES: true }).catch(() => {});

    channel.permissionOverwrites.edit(interaction.guild.id, { SEND_MESSAGES: true }).catch(() => {});

    channel.permissionOverwrites.edit(interaction.member.id, { SEND_MESSAGES: true }).catch(() => {});

    if (member) {
      channel.permissionOverwrites.edit(member, { SEND_MESSAGES: true }).catch(() => {});
    }

    if (memberr) {
      channel.permissionOverwrites.edit(memberr, { SEND_MESSAGES: true }).catch(() => {});
    }

    if (verified) {
      channel.permissionOverwrites.edit(verified, { SEND_MESSAGES: true }).catch(() => {});
    }

    const embed = new MessageEmbed()
    .setDescription(`${success} | Successfully unlocked **${channel}** ${logging && logging.moderation.include_reason === "true" ? `\n\n**Reason:** ${reason}` : ``}`)
    .setColor(client.color.green)
    interaction.reply({ embeds: [embed] })
    .then(() => {
      if (logging && logging.moderation.delete_reply === "true") {
        setTimeout(() => {
          interaction.deleteReply().catch(() => {});
        }, 5000);
      }
    })
    .catch(() => {});
  }
};