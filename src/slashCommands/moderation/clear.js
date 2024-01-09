const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");
let messageDisplay = "messages";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Purges a channels messages")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of messages to clear")
        .setRequired(true),
    )
    .addUserOption((option) =>
      option.setName("member").setDescription("The member"),
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("The channel"),
    ),
  async execute(interaction) {
    try {
      const logging = await Logging.findOne({ guildId: interaction.guild.id });

      const client = interaction.client;
      const fail = client.emoji.fail;
      const success = client.emoji.success;

      const amount = interaction.options.getString("amount");
      const member = interaction.options.getMember("member");
      const channel =
        interaction.options.getChannel("channel") ||
        interaction.guild.channels.cache.get(interaction.channel.id);
      interaction.deferReply({ ephemeral: true });

      if (amount < 0 || amount > 100) {
        let invalidamount = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(`${fail} | Purge Error`)
          .setDescription(`Please Provide a message count between 1 - 100!`)
          .setTimestamp()
          .setFooter({
            text: "https://mee8.ml/",
          })
          .setColor(client.color.red);
        return interaction.editReply({
          embeds: [invalidamount],
          ephemeral: true,
        });
      }

      let messages;
      if (member) {
        messages = (await channel.messages.fetch({ limit: amount })).filter(
          (m) => m.member.id === member.id,
        );
      } else messages = amount;

      if (messages.size === 0) {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `
            ${fail} | Unable to find any messages from ${member}. 
            `,
              )
              .setColor(interaction.client.color.red),
          ],
          ephemeral: true,
        });
      } else {
        if (messages == 1) {
          messageDisplay = "message";
        } else {
          messageDisplay = "messages";
        }
        channel.bulkDelete(messages, true).then((messages) => {
          const embed = new MessageEmbed()

            .setDescription(
              `${success} | Successfully deleted **${messages.size}** ${messageDisplay}`,
            )

            .setColor(interaction.client.color.green);

          if (member) {
            embed
              .spliceFields(1, 1, {
                name: "Found Messages",
                value: `\`${messages.size}\``,
                inline: true,
              })
              .spliceFields(1, 0, {
                name: "Member",
                value: `${member}`,
                inline: true,
              });
          }

          interaction.editReply({ embeds: [embed], ephemeral: true });
        });
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
