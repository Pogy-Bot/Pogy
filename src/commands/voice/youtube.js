const Command = require("../../structures/Command");
const { createAudioPlayer, joinVoiceChannel, createAudioResource, StreamType, getVoiceConnection } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core");
module.exports = class PlayCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "play",
      aliases: [],
      description: "Play a song",
      category: "General",
      usage: "play <url>",
      cooldown: 2,
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

      const url = message.content.split(" ")[1];

      if (!url || !ytdl.validateURL(url)) {
        return message.channel.send("Invalid YouTube URL!");
      }

      const info = await ytdl.getInfo(url);
      const stream = await ytdl(url, { filter: 'audioonly' });
      const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });

      player.play(resource);

      connection.subscribe(player);

      const embed = new MessageEmbed()
        .setTitle("Requested by " + message.author.username)
        .setDescription(`Playing ${url}`)
        .setColor("#FF5733");
      const nowPlayingMessage = await message.channel.send({ embeds: [embed] });

      // Store the connection and player information in a map for later use
      message.guild.playerInfo = { connection, player, nowPlayingMessage };

    } catch (error) {
      console.error("Error playing audio:", error);
      message.channel.send("An error occurred during playback.");
    }
  }
};