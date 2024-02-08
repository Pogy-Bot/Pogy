const Command = require("../../structures/Command");
const { createAudioPlayer, joinVoiceChannel, createAudioResource } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const path = require('path');

module.exports = class PlayCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "play",
      aliases: [],
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
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

      const player = createAudioPlayer();

      const filePath = path.join(__dirname, '../../assets/audio/Gigachad.mp3');
      const stream = createReadStream(filePath);
      const resource = createAudioResource(stream);

      player.play(resource);

      connection.subscribe(player);

      message.channel.send("Playing the sound!");
    } catch (error) {
      console.error("Error in the play command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
