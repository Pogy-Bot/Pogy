const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("bean")
  .setDescription("Beans a user")
  .addUserOption((option) => option.setName("member").setDescription("The member to bean").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason to bean")),
  async execute(interaction) {
    const logging = await Logging.findOne({
      guildId: interaction.guild.id
    });
    const client = interaction.client;
    const member = interaction.options.getMember("member")
    const reason = interaction.options.getString("reason")

    if(!member) {
      let usernotfound = new MessageEmbed()
      .setColor(client.color.red)
      .setDescription(`${client.emoji.fail} | I couldn't find that user.`)
      .setTimestamp()
      return interaction.reply({ embeds: [usernotfound] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if(member.id === interaction.member.id) {
      let beanselferror = new MessageEmbed()
      .setColor(client.color.red)
      .setDescription(`${client.emoji.fail} | <@${interaction.member.id}>, You can't bean yourself.`)
      return interaction.reply({ embeds: [beanselferror] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000)
        }
      })
      .catch(() => {});
    }

    if(member.roles.highest.position >= interaction.member.roles.highest.position) {
      let rolesmatch = new MessageEmbed()
      .setColor(client.color.red)
      .setDescription(`${client.emoji.fail} | They have more power than you or have equal power as you do!`)
      .setTimestamp()
      return interaction.reply({ embeds: [rolesmatch] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000)
        }
      })
      .catch(() => {});
    }

    if(member) {
      let embed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription(`${client.emoji.success} | <@${member.id}> has been **beaned** | \`${reason || `You have been beaned by ${interaction.user.tag}`}\``)
      .setTimestamp()
      return interaction.reply({ embeds: [embed] })
    } else {
      return interaction.reply(`I can't bean them, make sure that my role is above their role.`)
    }
    return undefined
  }
};