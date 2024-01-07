const Command = require("../../structures/Command");
const { MessageAttachment } = require("discord.js");
const fs = require("fs");
const path = require("path");
const discordTranscripts = require("@krayon/discord-html-transcripts");

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
      // Permission check and channel validation
      if (!message.member.permissions.has("MANAGE_CHANNELS")) {
        return message.reply("You need the MANAGE_CHANNELS permission to use this command.");
      }

      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

      if (!channel || channel.type !== "GUILD_TEXT") {
        return message.reply("Please provide a valid text channel.");
      }

      let fetchedMessages = await channel.messages.fetch({ limit: 100 });
      let lastMessageID = fetchedMessages.lastKey();
      let transcriptMessages = [];

      while (fetchedMessages.size > 0 && transcriptMessages.length < 1000) {
        transcriptMessages.push(
          ...fetchedMessages.map((msg) => ({
            content: msg.content || "(No content)",
            createdAt: msg.createdAt,
            username: msg.author.username,
          }))
        );

        fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastMessageID });
        lastMessageID = fetchedMessages.lastKey();
      }

      // Generate HTML content for transcript with dark-themed layout
      const transcriptContent = transcriptMessages.map((msg) => {
        return `
          <div class="message-item">
            <div class="message-header">
              <span class="username">${msg.username}</span>
              <span class="timestamp">${msg.createdAt}</span>
            </div>
            <div class="message-content">${msg.content}</div>
          </div>
        `;
      });

      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                background-color: #36393f;
                color: #fff;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              .transcript {
                width: 80%;
                margin: 20px auto;
              }
              .message-item {
                border: 1px solid #586265;
                border-radius: 5px;
                margin-bottom: 10px;
                padding: 10px;
                background-color: #2f3136;
              }
              .message-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
                color: #7289da;
              }
              .username {
                font-weight: bold;
              }
              .timestamp {
                color: #b9bbbe;
              }
              .message-content {
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <div class="transcript">
              ${transcriptContent.join("\n")}
            </div>
          </body>
        </html>
      `;

      // Create temporary file
      const filePath = path.join(__dirname, "transcript.html");
      fs.writeFileSync(filePath, htmlContent);

      // Ensure file path exists before sending
      if (!fs.existsSync(filePath)) {
        return message.reply("Error: Transcript file not found.");
      }

      // Create and send attachment using MessageAttachment
      const attachment = new MessageAttachment(filePath, "transcript.html");
      const filePathToSend = attachment.path;
      await message.channel.send({ content: "Transcript generated!", files: [filePathToSend] });

      // Delete temporary file
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error(error);
      message.reply("Failed to generate transcript.");
    }
  }
};
