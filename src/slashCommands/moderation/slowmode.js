const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Enables slowmode in a channel with the specified rate")
    .addStringOption((option) =>
      option
        .setName("rate")
        .setDescription("The rate of messages/second")
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("The channel"),
    ),
  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }
      const client = interaction.client;
      const fail = client.emoji.fail;
      const success = client.emoji.success;

      const logging = await Logging.findOne({ guildId: interaction.guild.id });
      const guildDB = await Guild.findOne({
        guildId: interaction.guild.id,
      });
      const language = require(`../../data/language/${guildDB.language}.json`);

      let index = 1;
      let channel = interaction.options.getChannel("channel");
      if (!channel) {
        channel = interaction.channel;
        index--;
      }

      if (channel.type != "GUILD_TEXT" || !channel.viewable) {
        let channelerror = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`${fail} | I can't view the provided channel!`)
          .setTimestamp()
          .setFooter({ text: "https://Pogy.ml/" })
          .setColor(interaction.guild.me.displayHexColor);
        return interaction
          .reply({ embeds: [channelerror] })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000);
            }
          })
          .catch(() => {});
      }

      const rate = interaction.options.getString("rate");
      if (!rate || rate < 0 || rate > 59) {
        let embed = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `${fail} | Please provide a rate limit between 0 and 59 seconds`,
          )
          .setTimestamp()
          .setFooter({ text: "https://Pogy.ml/" })
          .setColor(interaction.guild.me.displayHexColor);
        return interaction
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

      const number = parseInt(rate);
      if (isNaN(number)) {
        let embed = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `${fail} | Please provide a rate limit between 0 and 59 seconds`,
          )
          .setTimestamp()
          .setFooter({ text: "https://Pogy.ml/" })
          .setColor(interaction.guild.me.displayHexColor);
        return interaction
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

      await channel.setRateLimitPerUser(rate);

      if (rate === "0") {
        return interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `${success} | Slow Mode has been disabled, good luck!`,
                )
                .setColor(interaction.guild.me.displayHexColor),
            ],
          })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000);
            }
          })
          .catch(() => {});
      } else {
        interaction
          .reply({
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `${success} | Slow Mode was successfully set to **1 msg/${rate}s**`,
                )
                .setColor(interaction.guild.me.displayHexColor),
            ],
          })
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
