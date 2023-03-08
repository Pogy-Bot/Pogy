const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("verify")
  .setDescription("Verify a user yourself.")
  .addUserOption((option) => option.setName("member").setDescription("The user to verify").setRequired(true)),
  async execute(interaction) {
    const client = interaction.client;
    const fail = client.emoji.fail;
    const success = client.emoji.success;
    const member = interaction.options.getMember("member");
    const logging = await Logging.findOne({ guildId: interaction.guild.id });
    const memberrole = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === "member");
    let memberr = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === "members");
    let verified = interaction.guild.roles.cache.find((r) => r.name.toLowerCase() === "verified");

    if(!member) {
      let embed = new MessageEmbed()
      .setDescription(`${fail} | Please provide a valid user mention!`)
      .setColor(client.color.red)
      return interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {})
    }

    if(member) {
      if(memberrole) {
        member.roles.add(memberrole)
      }
      if (memberr) {
        member.roles.add(memberr)
      }
      if (verified) {
        member.roles.add(verified)
      }

      let embed = new MessageEmbed()
      .setDescription(`${success} | ${member} has been verified.`)
      .setColor(client.color.green)
      interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000);
        }
      })
      .catch(() => {})
    }
  }
};