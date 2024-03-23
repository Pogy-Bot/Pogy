// EmptyCommand.js
const Command = require("../../structures/Command");
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice'); // Import the voice function

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "join", // Replace with your command name
      aliases: ["joinvc", "vc", "connect", "jvc"], // Add any aliases for your command
      description: "Makes the bot join your current voice channel.",
      category: "Voice", // Adjust the category as needed
      cooldown: 5,
      // Add any other command options or configurations
    });
  }

  async run(message) {
    try {
      if (!message.member.voice.channel) {
        return message.channel.send("You're not in a voice channel!");
      }

      const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      connection.on('stateChange', (oldState, newState) => {
        if (newState.status === VoiceConnectionStatus.Disconnected) {
          console.error('The connection disconnected');
        }
      });

      connection.on('error', (error) => {
        console.error('Something went wrong:', error);
        message.channel.send("Failed to join the voice channel. Please check my permissions.");
      });

      message.channel.send("Joined your voice channel!");
    } catch (error) {
      console.error("Error in the joinvc command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
