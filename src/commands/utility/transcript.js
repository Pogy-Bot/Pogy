const Command = require("../../structures/Command");
const { MessageAttachment } = require("discord.js");
const fs = require("fs");
const path = require("path");
const discordTranscripts = require("discord-html-transcripts"); // Import the package

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "transcript",
      aliases: ["trans", "textlog"],
      description: "Creates a transcript of a channel",
      category: "Utility",
      usage: "<channel mention or ID>",
      cooldown: 5,
    });
  }

  async run(message, args) {
    try {
      if (!message.member.permissions.has("MANAGE_CHANNELS")) {
        return message.reply("You need the MANAGE_CHANNELS permission to use this command.");
      }

      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

      if (!channel || channel.type !== "GUILD_TEXT") {
        return message.reply("Please provide a valid text channel.");
      }

      const messages = await channel.messages.fetch({ limit: 100 }); // Adjust the limit as needed

      // Generate the transcript using discord-transcript
      const transcript = await discordTranscripts.generateFromMessages(messages, channel);

      // Create the attachment and send it
      const attachment = new MessageAttachment(transcript, "transcript.html");
      await message.channel.send({ content: "Transcript generated!", files: [attachment] });

    } catch (error) {
      console.error(error);
      message.reply("Failed to generate transcript.");
    }
  }
};
