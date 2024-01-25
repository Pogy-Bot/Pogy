const Command = require("../../structures/Command");
const {
  createAudioPlayer,
  joinVoiceChannel,
  createAudioResource,
  StreamType,
} = require("@discordjs/voice");
const { createReadStream } = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "play",
      aliases: [],
      description: "play a song",
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
      const stream = await ytdl(url, { filter: "audioonly" });
      const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
      });

      player.play(resource);

      connection.subscribe(player);

      const embed = new MessageEmbed()
        .setTitle("Requested by " + message.author.username)
        .setDescription(`Playing ${url}`)
        .setColor("#FF5733");
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error playing audio:", error);
      message.channel.send("An error occurred during playback.");
    }
  }
};
