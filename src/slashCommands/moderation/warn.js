const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild.js");
const warnModel = require("../../database/models/moderation.js");
const discord = require("discord.js");
const randoStrings = require("../../packages/randostrings.js");
const random = new randoStrings();
const Logging = require("../../database/schemas/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user in a specific guild")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to warn")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the warn"),
    ),
  async execute(interaction) {
    try {
      const client = interaction.client;
      const logging = await Logging.findOne({
        guildId: interaction.guild.id,
      });
      const guildDB = await Guild.findOne({
        guildId: interaction.guild.id,
      });
      let language = require(`../../data/language/${guildDB.language}.json`);

      const mentionedMember = interaction.options.getMember("member");
      const reason =
        interaction.options.getString("reason") || "No Reason Provided";

      if (!mentionedMember) {
        let validmention = new MessageEmbed()
          .setColor(client.color.red)
          .setDescription(`${client.emoji.fail} | ${language.warnMissingUser}`)
          .setTimestamp();
        return interaction
          .reply({ embeds: [validmention] })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000);
            }
          })
          .catch(() => {});
      }

      if (
        mentionedMember.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        let rolesmatch = new MessageEmbed()
          .setColor(client.color.red)
          .setDescription(`${client.emoji.fail} | ${language.warnHigherRole}`)
          .setTimestamp();
        return interaction
          .reply({ embeds: [rolesmatch] })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000);
            }
          })
          .catch(() => {});
      }
      let warnID = random.password({
        length: 18,
        string:
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      });

      let warnDoc = await warnModel
        .findOne({
          guildID: interaction.guild.id,
          memberID: mentionedMember.id,
        })
        .catch((err) => console.log(err));

      if (!warnDoc) {
        warnDoc = new warnModel({
          guildID: interaction.guild.id,
          memberID: mentionedMember.id,
          modAction: [],
          warnings: [],
          warningsID: [],
          moderator: [],
          date: [],
        });

        await warnDoc.save().catch((err) => console.log(err));

        warnDoc = await warnModel.findOne({
          guildID: interaction.guild.id,
          memberID: mentionedMember.id,
        });
      }
      warnDoc.modType.push("warn");
      warnDoc.warnings.push(reason);
      warnDoc.warningID.push(warnID);
      warnDoc.moderator.push(interaction.user.id);
      warnDoc.date.push(Date.now());

      await warnDoc.save().catch((err) => console.log(err));
      let dmEmbed;
      if (
        logging &&
        logging.moderation.warn_action &&
        logging.moderation.waran_action !== "1"
      ) {
        if (logging.moderation.warn_action === "2") {
          dmEmbed = `${interaction.client.emoji.fail} | You've been warned in **${interaction.guild.name}**`;
        } else if (logging.moderation.warn_action === "3") {
          dmEmbed = `${interaction.client.emoji.fail} | You've been warned in **${interaction.guild.name}**\n\n__**Reason:**__ ${reason}`;
        } else if (logging.moderation.warn_action === "4") {
          dmEmbed = `${interaction.client.emoji.fail} | You've been warned in **${interaction.guild.name}**.\n\n__**Moderator:**__ ${interaction.author} **(${interaction.author.tag})**\n__**Reason:**__ ${reason}`;
        }

        mentionedMember
          .send({
            embeds: [
              new MessageEmbed()
                .setColor(interaction.client.color.red)
                .setDescription(dmEmbed),
            ],
          })
          .catch(() => {});
      }

      if (mentionedMember) {
        interaction
          .reply({
            embeds: [
              new MessageEmbed().setColor(client.color.green)
                .setDescription(`${language.warnSuccessful
                .replace("{emoji}", client.emoji.success)
                .replace("{user}", `**${mentionedMember.user.tag}**`)}
            ${
              logging && logging.moderation.include_reason === "true"
                ? `\n\n**Reason:** ${reason}`
                : ``
            }`),
            ],
          })
          .then(async () => {
            if (logging && logging.moderation.deleteReply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000);
            }
          })
          .catch(() => {});
      } else {
        let failembed = new MessageEmbed()
          .setColor(client.color.red)
          .setDescription(
            `${client.emoji.fail} | I can't warn that member. Make sure that my role is above their role or that I have sufficient permissions to execute the command.`,
          )
          .setTimestamp();
        return interaction.reply({ embeds: [failembed] });
      }
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: "This command cannot be used in Direct Messages.",
        ephemeral: true,
      });
    }
  },
};
