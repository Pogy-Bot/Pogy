const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setnickname")
    .setDescription("Changes the nickname of a provided user")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to change the nickname of")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("nickname").setDescription("The nickname"),
    ),
  async execute(interaction) {
    try {
      const client = interaction.client;
      const fail = client.emoji.fail;
      const success = client.emoji.success;
      const logging = await Logging.findOne({ guildId: interaction.guild.id });

      const member = interaction.options.getMember("member");
      const nickname = interaction.options.getString("nickname");

      if (!interaction.member.permissions.has("MANAGE_NICKNAMES"))
        return interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });

      if (!member) {
        const usernotfound = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(`${fail} Set Nickname Error`)
          .setDescription("Please provide a valid user")
          .setTimestamp()
          .setFooter({ text: "https://mee8.ml" })
          .setColor(client.color.red);
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

      if (member.id === interaction.member.id) {
        const setnickerror = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(`${fail} Set Nickname Error`)
          .setDescription("You can't change your own nickname!")
          .setTimestamp()
          .setFooter({ text: "https://mee8.ml" })
          .setColor(client.color.red);
        return interaction
          .reply({ embeds: [setnickerror] })
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
        member.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        const rolesmatch = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(`${fail} Set Nickname Error`)
          .setDescription(
            "The provided user has either an equal or higher role.",
          )
          .setTimestamp()
          .setFooter({ text: "https://mee8.ml" })
          .setColor(client.color.red);
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

      if (!nickname) {
        const oldNickname = member.nickname;
        await member.setNickname("");
        const embed = new MessageEmbed()
          .setDescription(`${success} | Nickname for ${member} was reset.`)
          .setColor(client.color.green);
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

      let nick = nickname;
      if (nickname) {
        try {
          const oldNickname = member.nickname || "None";
          await member.setNickname(nick);
          const embed = new MessageEmbed()
            .setDescription(
              `${success} | **${oldNickname}**'s nickname was set to **${nick}**`,
            )
            .setColor(client.color.green);
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
        } catch (err) {
          interaction.client.logger.error(err.stack);
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: `${interaction.user.tag}`,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTitle(`${fail} Set Nickname Error`)
                .setDescription(
                  `Please ensure my role is above the provided user's role.`,
                )
                .setTimestamp()
                .setFooter({ text: "https://mee8.ml/" })
                .setColor(client.color.red),
            ],
          });
        }
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
