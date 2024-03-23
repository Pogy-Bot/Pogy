const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Purges a channel's messages")
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

      if (amount < 0 || amount > 1000) {
        let invalidAmountEmbed = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
          })
          .setTitle(`${fail} | Purge Error`)
          .setDescription(`Please provide a message count between 1 - 1000!`)
          .setTimestamp()
          .setFooter({
            text: "https://Pogy.ml/",
          })
          .setColor(client.color.red);
        return interaction.reply({
          embeds: [invalidAmountEmbed],
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
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `${fail} | Unable to find any messages from ${member}.`,
              )
              .setColor(interaction.client.color.red),
          ],
          ephemeral: true,
        });
      } else {
        await deleteMessagesInBatches(channel, messages, interaction, success);
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

async function deleteMessagesInBatches(
  channel,
  messages,
  interaction,
  success,
) {
  let totalMessagesDeleted = 0;
  while (messages > 0) {
    const messagesToDelete = messages.slice(0, 100);
    await channel
      .bulkDelete(messagesToDelete, true)
      .then((deletedMessages) => {
        totalMessagesDeleted += deletedMessages.size;
      })
      .catch(console.error);

    messages = messages.slice(100);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second between batches
  }

  const embed = new MessageEmbed()
    .setDescription(
      `${success} | Successfully deleted **${totalMessagesDeleted}** ${totalMessagesDeleted === 1 ? "message" : "messages"}.`,
    )
    .setColor(interaction.client.color.green);

  interaction.reply({ embeds: [embed], ephemeral: true });
}
