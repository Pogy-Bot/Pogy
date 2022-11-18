const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const darkpassword = require("generate-password");
const Logging = require("../../database/schemas/logging");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("modnick")
  .setDescription("Moderate a users nickname to make pinging possible")
  .addUserOption((option) => option.setName("member").setDescription("The user to moderate their nickname").setRequired(true))
  .addStringOption((option) => option.setName("reason").setDescription("The reason for the nickname moderation")),
  async execute(interaction) {
    const client = interaction.client
    const logging = await Logging.findOne({ guildId: interaction.guild.id });

    const member = interaction.options.getMember("member")
    const reason = interaction.options.getString("reason") || "No reason Provided";

    const impostorpassword = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)

    if(!interaction.member.permissions.has("MANAGE_NICKNAMES")) return interaction.followUp({ content: "You do not have permission to use this command." });

    if(!member) {
      let validmention = new MessageEmbed()
      .setColor("RED")
      .setDescription(`${client.emoji.fail} | Please mention a valid member!`)
      return interaction.reply({ embeds: [validmention] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000)
        }
      })
      .catch(() => {})
    }
    if(member === interaction.author) {
      let modnickerror = new MessageEmbed()
      .setColor("RED")
      .setDescription(`${client.emoji.fail} | You can't moderate your own nickname!`)
      return interaction.reply({ embeds: [modnickerror] })

      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if(member.roles.highest.position >= interaction.member.roles.highest.position) {
      let rolesmatch = new MessageEmbed()
      .setColor("RED")
      .setDescription(`${client.emoji.fail} | They have more power than you or have equal power as you do!`)
      return interaction.reply({ embeds: [rolesmatch] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if(member) {
      const oldNickname = member.nickname || "None";
      await member.setNickname(`Moderated Nickname ${impostorpassword}`)
      let embed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription(`${client.emoji.success} | Moderated ${member}'s nickname for \`${reason}\``)
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
    if(member) {
      let dmEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription(`**Nickname Moderated**\nYour nickname was moderated in **${interaction.guild.name}**. If you would like to change your nickname to something else, please reach out to a staff member.\n**Possible Reasons**\n• Your name was not typeable on a standard English QWERTY keyboard.\n• Your name contained words that are not suitable for the server.\n• Your name was not mentionable.\n\n__**Moderator:**__ ${interaction.author} **(${interaction.author.tag})**\n__**Reason:**__ ${reason}`)
      .setTimestamp()
      member.send({ embeds: [dmEmbed] })
    } else {
      let failembed = new MessageEmbed()
      .setColor(client.color.red)
      .setDescription(`${client.emoji.fail} | I can't moderate their nickname, make sure that my role is above their role or that I have sufficient permissions to run the command.`)
      .setTimestamp()
      return interaction.reply({ embeds: [failembed], ephemeral: true })
    }
  }
};
