const { SlashCommandBuilder } = require("@discordjs/builders");
const Logging = require("../../database/schemas/logging");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("dm")
  .setDescription("DMs a user")
  .addUserOption((option) => option.setName("member").setDescription("The user to dm").setRequired(true))
  .addStringOption((option) => option.setName("message").setDescription("The message to send to the user.").setRequired(true)),
  async execute(interaction) {
    try {
      const client = interaction.client;
      const logging = await Logging.findOne({ guildId: interaction.guild.id })
  
      const member = interaction.options.getMember("member")
      const message = interaction.options.getString("message")
  
      if(!member) {
        const embed = new MessageEmbed()
        .setDescription(`${client.emoji.fail} | Please provide a valid member!`)
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
  
      if (member.id === interaction.member.id) {
        const embed = new MessageEmbed()
        .setDescription(`${client.emoji.success} | That was kind of... Ok..? But why would you dm yourself?`)
        .setColor(client.color.green)
        interaction.reply({ embeds: [embed] })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000)
          }
        })
        .catch(() => {});
        const dmEmbed = new MessageEmbed()
        .setTitle(`Why are you DMing yourself?`)
        .setDescription(`${message}`)
        .setColor("RANDOM")
        member.send({ embeds: [dmEmbed] });
      } else {
        const embed = new MessageEmbed()
        .setDescription(`${client.emoji.success} | I have successfully sent the message to ${member}!`)
        .setColor(client.color.green)
        interaction.reply({ embeds: [embed] })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000)
          }
        })
        .catch(() => {});
        const dmEmbed = new MessageEmbed()
        .setTitle(`New Message from ${interaction.user.tag}`)
        .setDescription(`${message}`)
        .setColor("RANDOM")
        member.send({ embeds: [dmEmbed] })
      }
    } catch {
      interaction.reply({ content: `This command cannot be used in Direct Messages. This is because you are already in a DM with the bot!`, ephemeral: true });
    }
  }
};