const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const warnModel = require("../../database/models/moderation");
const Logging = require("../../database/schemas/logging.js");
const Guild = require("../../database/schemas/Guild.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("removewarn")
  .setDescription("Removes a warning from a user")
  .addUserOption((option) => option.setName("member").setDescription("The member").setRequired(true))
  .addStringOption((option) => option.setName("warning").setDescription("The warn ID").setRequired(true)),
  async execute(interaction) {
    const client = interaction.client;
    const logging = await Logging.findOne({
      guildId: interaction.guild.id
    });
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });
    let language = require(`../../data/language/${guildDB.language}.json`);

    if(!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    
    const mentionedMember = interaction.options.getMember("member")
    const warnID = interaction.options.getString("warning")

    if(!mentionedMember) {
      let usernotfound = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.member.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${client.emoji.fail} | I couldn't find that member!`)
      .setTimestamp()
      .setColor(client.color.red)
      return interaction.reply({ embeds: [usernotfound] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    const mentionedPosition = mentionedMember.roles.highest.position;
    const memberPosition = interaction.member.roles.highest.position;

    if (mentionedMember.roles.highest.position >= interaction.member.roles.highest.position) {
      let rolesmatch = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.member.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${client.emoji.fail} | They have more power than you or have the same power as you do!`)
      .setTimestamp()
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

    const warnDoc = await warnModel.findOne({
      guildID: interaction.guild.id,
      memberID: mentionedMember.id,
    })
    .catch((err) => console.log(err));

    if(!warnDoc || !warnDoc.warnings.length) {
      let nowarnerror = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.member.displayAvatarURL({ dynamic: true })
          })
          .setDescription(`${client.emoji.fail} | No warnings found for ${mentionedMember}`)
      .setTimestamp()
      .setColor(client.color.red)
      return interaction.reply({ embeds: [nowarnerror] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    if(!warnID) {
      let warnIDinvalid = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.member.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${client.emoji.fail} | ${language.rmWarnInvalid}`)
      .setTimestamp()
      .setColor(client.color.red)
      return interaction.reply({ embeds: [warnIDinvalid] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    let check = warnDoc.warningID.filter((word) => warnID === word);

    if(!warnDoc.warningID.includes(warnID)) {
      let warnremoveerror = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.member.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${client.emoji.fail} | ${language.rmWarnInvalid}`)
      .setTimestamp()
      .setColor(client.color.red)
      return interaction.reply({ embeds: [warnremoveerror] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    if(!check) {
      let no = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
              conURL: interaction.member.displayAvatarURL({ dynamic: true })
          })
          .setDescription(`${client.emoji.fail} | ${language.rmWarnInvalid}`)
          .setTimestamp()
          .setColor(client.color.red)
      return interaction.reply({ embeds: [no] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    let toReset = warnDoc.warningID.length;

    //warnDoc.memberID.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1)
    //warnDoc.guildID.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1)
    warnDoc.warnings.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.warningID.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.modType.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.moderator.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);
    warnDoc.date.splice(toReset - 1, toReset !== 1 ? toReset - 1 : 1);

    await warnDoc.save().catch((err) => console.log(err));

    const removeembed = new MessageEmbed()
    .setDescription(
        `${
          interaction.client.emoji.success
        } | Cleared Warn **#${warnID}** from **${
          mentionedMember.user.tag
        }**`
      )
    .setColor(interaction.client.color.green);
    interaction.reply({ embeds: [removeembed] })
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