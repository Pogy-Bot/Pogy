const { MessageActionRow, MessageButton } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class PollCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "unhide",
      aliases: [],
      description: " hides a the current channel",
      category: "Moderation",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('confirmLock')
            .setLabel('Unhide')
            .setStyle('DANGER'),
          new MessageButton()
            .setCustomId('cancelLock')
            .setLabel('Cancel')
            .setStyle('SECONDARY'),
        );

      const pollMessage = await message.channel.send({
        content: "Do you want to unhide this channel?",
        components: [row],
      });

      const filter = (interaction) => {
        return ['confirmLock', 'cancelLock'].includes(interaction.customId) && interaction.user.id === message.author.id;
      };

      const collector = pollMessage.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'confirmLock') {
          // Lock the channel here
          const channel = message.channel;
          await channel.permissionOverwrites.edit(channel.guild.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, ADD_REACTIONS: false });
          await interaction.update({ content: 'Channel unhidden successfully!', components: [] });
        } else {
          await interaction.update({ content: 'Hide canceled.', components: [] });
        }
        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          pollMessage.edit({ content: 'Confirmation timed out.', components: [] });
        }
      });
    } catch (error) {
      console.error("Error in the poll command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
