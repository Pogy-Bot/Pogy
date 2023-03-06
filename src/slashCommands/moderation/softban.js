const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("softban")
  .setDescription("Softbans a user")
  .addUserOption((option) => option.setName("member").setDescription("The member to softban").setRequired(true))
  .addStringOption((option) => option.setName("reason").setDescription("The reason")),
  async execute(interaction) {
    let client = interaction.client;

    const logging = await Logging.findOne({ guildId: interaction.guild.id });

    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id
    });
    const language = require(`../../data/language/${guildDB.language}.json`);

    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("reason") || "No Reason Provided";

    if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });

    if (!member) {
      let embed = new MessageEmbed()
      .setDescription(`${client.emoji.fail} | ${language.softbanNoUser}`)
      .setColor(client.color.red)
      return interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if (member === interaction.member) {
      let embed = new MessageEmbed()
      .setDescription(`${client.emoji.fail} | ${language.softbanSelfUser}`)
      .setColor(client.color.red)
      return interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      let rolesmatch = new MessageEmbed()
      .setDescription(`${client.emoji.fail} | ${language.softbanEqualRole}`)
      .setColor(client.color.red)
      return interaction.reply({ embeds: [rolesmatch] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    if(reason.length > 1024) reason = reason.slice(0, 1021) + "...";
    if(member) {
    await member.ban({
      reason: `${reason} / ${language.softbanResponsible}: ${interaction.user.tag}`,
      days: 7,
    });
    await interaction.guild.members.unban(
      member.user,
      `${reason} / ${language.softbanResponsible}: ${interaction.user.tag}`
    );

      const embed = new MessageEmbed()
      .setDescription(`${client.emoji.success} | ${language.softbanSuccess} **${member.user.tag}** ${logging && logging.moderation.include_reason === "true" ? `\n\n**Reason:** ${reason}` : ``}`)
      .setColor(client.color.green);
      interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }
  }
};