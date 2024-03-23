const Command = require("../../structures/Command");
let sharedPlayer = null;
const { MessageEmbed } = require("discord.js");
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  createAudioPlayer,
  VoiceState,
} = require("@discordjs/voice"); // Import the voice function
// Function to access or create the shared player
const ytdl = require("ytdl-core");
async function getSharedPlayer(message) {
  const connection = message.member.voice.channel.connection;
  if (!connection) {
    return message.channel.send("Not connected to a voice channel.");
  }

  if (!sharedPlayer) {
    sharedPlayer = createAudioPlayer();
    connection.subscribe(sharedPlayer);
  }

  return sharedPlayer;
}
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "stop",
      aliases: [],
      description: "Stop playback",
      category: "General",
      cooldown: 2,
    });
  }

  run(message) {
    try {
      const guildId = message.guild.id;
      const { connection, player, nowPlayingMessage } =
        message.guild.playerInfo || {};

      if (!connection || !player || !nowPlayingMessage) {
        return message.channel.send("Not currently playing any song.");
      }

      connection.destroy(); // Disconnect from the voice channel

      const embed = new MessageEmbed()
        .setDescription("Playback stopped.")
        .setColor("#FF5733");
      nowPlayingMessage.edit({ embeds: [embed] });

      // Remove player information from the guild map
      delete message.guild.playerInfo;
    } catch (error) {
      console.error("Error stopping playback:", error);
      message.channel.send("An error occurred while stopping playback.");
    }
  }
};
