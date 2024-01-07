const Command = require("../../structures/Command");
const { MessageAttachment } = require("discord.js");
const fs = require("fs");
const path = require("path");

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

      // Fetch messages and generate transcript
      const fetchedMessages = await channel.messages.fetch({ limit: 100 });

      // Handle undefined or non-iterable fetchedMessages
      if (!fetchedMessages || !fetchedMessages.size) {
        return message.reply("Error: No messages found in the channel.");
      }

      const messages = fetchedMessages.map((msg) => {
        return {
          content: msg.content || "(No content)",
          createdAt: msg.createdAt ? msg.createdAt.toUTCString() : "(No date)",
          username: msg.author.username,
        };
      });

      // Generate HTML content for transcript with usernames and Pogy-themed dark layout
      const transcriptContent = messages.map((msg) => {
        return `
          <div class="message-item">
            <span class="timestamp">${msg.createdAt}</span>
            <span class="username">${msg.username}</span>
            <span class="message-content">${msg.content}</span>
          </div>
        `;
      });

      // HTML content with Pogy-themed dark styling for longer lines
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Channel Transcript</title>
            <style>
              body {
                background-color: #292b2f;
                color: #fff;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
              }
              .message-item {
                border-bottom: 1px solid #586265;
                padding: 10px 0;
              }
              .timestamp {
                color: #72767d;
                margin-right: 10px;
              }
              .username {
                color: #7289da;
                font-weight: bold;
                margin-right: 5px;
              }
              .message-content {
                margin-left: 5px;
                word-wrap: break-word;
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

      // Create a temporary file for the HTML content
      const filePath = path.join(__dirname, "transcript.html");
      fs.writeFileSync(filePath, htmlContent);

      // Ensure file path exists before sending
      if (!fs.existsSync(filePath)) {
        return message.reply("Error: Transcript file not found.");
      }

      // Create and send the transcript file as an attachment
      const attachment = new MessageAttachment(filePath, "transcript.html");
      await message.channel.send({ content: "Transcript generated!", files: [attachment] });

      // Delete temporary file
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error(error);
      message.reply("Failed to generate transcript.");
    }
  }
};
