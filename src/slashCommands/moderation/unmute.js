const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const Logging = require("../../database/schemas/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a person in the server!")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("Person who you want to put in timeout.")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason of the timeout"),
    ),
  async execute(interaction) {
    try {
      const client = interaction.client;
      const logging = await Logging.findOne({
        guildId: interaction.guild.id,
      });
      if (!interaction.member.permissions.has("MODERATE_MEMBERS"))
        return interaction.followUp({
          content: "You do not have permission to use this command.",
        });

      const member = interaction.options.getMember("member");
      const reason =
        interaction.options.getString("reason") || "No reason provided";

      if (!member) {
        let usernotfound = new MessageEmbed()
          .setColor("RED")
          .setDescription(`${client.emoji.fail} | I can't find that member`);
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
        member.roles.highest.position >=
        interaction.member.roles.highest.position
      ) {
        let rolesmatch = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `${client.emoji.fail} | They have more power than you or have equal power as you do!`,
          );
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

      if (member) {
        const response = await member.timeout(0 * 60 * 1000, reason);
        let timeoutsuccess = new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `${client.emoji.success} | ${member} has been unmuted.`,
          );
        return interaction
          .reply({ embeds: [timeoutsuccess] })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000);
            }
          })
          .catch(() => {});
      }
      if (member) {
        let dmEmbed = new MessageEmbed()
          .setColor("RED")
          .setDescription(
            `You have been unmuted in **${
              interaction.guild.name
            }**.\n\n__**Moderator:**__ ${interaction.author} **(${
              interaction.author.tag
            })**\n__**Reason:**__ ${reason || "No Reason Provided"}`,
          )
          .setTimestamp();
        member.send({ embeds: [dmEmbed] });
      } else {
        let failembed = new MessageEmbed()
          .setColor(client.color.red)
          .setDescription(
            `${client.emoji.fail} | I cannot unmute that member. Make sure that my role is above their role or that I have sufficient perms to execute the command, OR they aren't muted.`,
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
