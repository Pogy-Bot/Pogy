// HideChannelsCommand.js
const Command = require("../../structures/Command");
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const path = require('path');
module.exports = class HideChannelsCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "hidechannels",
      aliases: ["hidechans"],
      description: "Hide all channels from regular members, making them visible only to owners and admins.",
      category: "Moderation",
      cooldown: 10,
      // Add any other command options or configurations
    });
  }

  async run(message) {
    try {
      
      // Fetch all channels in the server
      const channels = message.guild.channels.cache;

      // Iterate through each channel and update permissions
      channels.forEach(async (channel) => {
        try {
          // Check if the channel is a text or voice channel
          if (channel.type === "text" || channel.type === "voice") {
            await channel.updateOverwrite(message.guild.roles.everyone, { VIEW_CHANNEL: false });
            await channel.updateOverwrite(message.guild.ownerID, { VIEW_CHANNEL: true });
            // You can add more roles (like admin roles) if needed

            message.channel.send(`Channel ${channel.name} is now visible only to owners and admins.`);
          }
        } catch (error) {
          console.error(`Error updating channel permissions for ${channel.name}:`, error);
          message.channel.send(`An error occurred while updating permissions for ${channel.name}.`);
        }
      });

      message.channel.send("All channels have been hidden from regular members.");
    } catch (error) {
      console.error("Error in the hidechannels command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
