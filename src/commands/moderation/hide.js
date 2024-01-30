const { MessageActionRow, MessageButton } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class PollCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "hide",
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
            .setLabel('Lock')
            .setStyle('DANGER'),
          new MessageButton()
            .setCustomId('cancelLock')
            .setLabel('Cancel')
            .setStyle('SECONDARY'),
        );

      const pollMessage = await message.channel.send({
        content: "Do you want to lock this channel?",
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
          await channel.permissionOverwrites.edit(channel.guild.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false, ADD_REACTIONS: false });
          await interaction.update({ content: 'Channel locked successfully!', components: [] });
        } else {
          await interaction.update({ content: 'Lock canceled.', components: [] });
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
