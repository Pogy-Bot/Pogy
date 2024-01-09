const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild.js");
const warnModel = require("../../database/models/moderation.js");
const randoStrings = require("../../packages/randostrings.js");
const random = new randoStrings();
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnpurge")
    .setDescription("Warns a user and removes their messages")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to warn")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to purge")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason to warn the user"),
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

      if (!interaction.member.permissions.has("MODERATE_MEMBERS"))
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });

      const fail = client.emoji.fail;
      const success = client.emoji.success;
      const mentionedMember = interaction.options.getMember("member");
      const amount = interaction.options.getNumber("amount");
      const reason =
        interaction.options.getString("reason") || "No Reason Provided";

      if (!mentionedMember) {
        let usernotfound = new MessageEmbed()
          .setColor(client.color.red)
          .setDescription(`${client.emoji.fail} | ${language.warnMissingUser}`)
          .setTimestamp();
        return interaction
          .reply({ embeds: [usernotfound] })
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
          .setDescrirption(`${client.emoji.fail} | ${language.warnHigherRole}`)
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

      if (amount < 0 || amount > 100) {
        let invalidamount = new MessageEmbed();
        new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(`${fail} | Warn Purge Error`)
          .setDescription(`Please Provide a message count between 1 - 100!`)
          .setTimestamp()
          .setFooter({
            text: "https://mee8.ml/",
          })
          .setColor(client.color.red);
        return interaction
          .reply({ embeds: [invalidamount] })
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
          warningID: [],
          moderator: [],
          date: [],
        });

        await warnDoc.save().catch((err) => console.log(err));

        warnDoc = await warnModel.findOne({
          guildID: interaction.guild.id,
          memberID: mentionedMember.id,
        });
      }
      warnDoc.modType.push("warn purge");
      warnDoc.warnings.push(reason);
      warnDoc.warningID.push(warnID);
      warnDoc.moderator.push(interaction.member.id);
      warnDoc.date.push(Date.now());

      await warnDoc.save().catch((err) => console.log(err));
      let dmEmbed;
      if (
        logging &&
        logging.moderation.warn_action &&
        logging.moderation.warn_action !== "1"
      ) {
        if (logging.moderation.warn_action === "2") {
          dmEmbed = `${interaction.client.emoji.fail} | You've been warned in **${interaction.guild.name}**.`;
        } else if (logging.moderation.warn_action === "3") {
          dmEmbed = `${interaction.client.emoji.fail} | You've been warned in **${interaction.guild.name}**.\n\n__**Reason:**__ ${reason}`;
        } else if (logging.moderation.warn_action === "4") {
          dmEmbed = `${interaction.client.emoji.fail} | You've been warned in **${interaction.guild.name}**.\n\n__**Moderator:**__ ${interaction.author} **(${interaction.user.tag})**\n__**Reason:**__ ${reason}`;
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

      // Purge
      const messages = (
        await interaction.channel.messages.fetch({ limit: amount })
      ).filter((m) => m.member.id === mentionedMember.id);
      if (messages.size > 0)
        await interaction.channel.bulkDelete(messages, true);

      if (mentionedMember) {
        const embed = new MessageEmbed()
          .setDescription(
            `${success} | **${mentionedMember.user.tag}** has been warned, with **${messages.size}** messages purged.\n\n__**Reason:**__ ${reason}`,
          )
          .setColor(client.color.green)
          .setTimestamp();
        interaction
          .reply({ embeds: [embed] })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000);
            }
          })
          .catch(() => {});
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
