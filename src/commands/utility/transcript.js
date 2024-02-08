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
      usage: "!transcript <channel mention or ID>",
      cooldown: 5,
      userPermissions: ["MANAGE_CHANNELS"], 
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

      const fetchedMessages = await channel.messages.fetch({ limit: 100 });

      if (!fetchedMessages || !fetchedMessages.size) {
        return message.reply("Error: No messages found in the channel.");
      }

      const messages = fetchedMessages.map((msg) => {
        return {
          content: msg.content || "(No content)",
          createdAt: msg.createdAt ? msg.createdAt.toUTCString() : "(No date)",
          username: msg.author.username,
          avatarURL: msg.author.displayAvatarURL({ format: "png", dynamic: true }),
          attachments: msg.attachments,
          reactions: msg.reactions,
        };
      });

      const transcriptContent = messages.map((msg, index) => {
        let messageContent = this.escapeHTML(msg.content);

        if (msg.attachments && msg.attachments.size > 0) {
          const attachmentLinks = Array.from(msg.attachments.values())
            .map((attachment) => `<a href="${attachment.url}" class="attachment-link">${attachment.name}</a>`)
            .join(', ');

          messageContent += `<br>Attachments: ${attachmentLinks}`;
        }

        return `
          <div class="message-item" id="message-${index}">
            <span class="timestamp">${msg.createdAt}</span>
            <span class="reactions"> Reactions ${msg.reactions.cache.size}</span>
            <span class="avatar-url"><img src="${msg.avatarURL}" /></span>
            <span class="username">${msg.username}</span>
            <span class="message-content">${messageContent}</span>
            <div class="message-tools" style="display: none;">
              <button class="highlight-button">Highlight</button>
              <button class="delete-button" data-index="${index}">&#128465;</button>
            </div>
          </div>
        `;
      });
      // wahh he put sytle in the same file. i dont care
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
                position: relative;
                transition: background-color 0.3s ease;
              }
              .timestamp {
                color: #72767d;
                margin-right: 10px;
              }
              .avatar-url img {
                width: 3.5dvh;
                height: 10;
            }
              .username {
                color: #7289da;
                font-weight: bold;
                margin-right: 5px;
              }
              .username:hover {
                color: #2b4ecc;
              }
              .message-content {
                margin-left: 5px;
                word-wrap: break-word;
                white-space: pre-wrap;
              }
              .message-tools {
                display: none;
                position: absolute;
                top: 0;
                right: 0;
                margin: 5px;
              }
              .message-item:hover .message-tools {
                display: flex;
                flex-direction: column;
              }
              .highlight-button,
              .delete-button {
                padding: 5px;
                margin: 5px;
                cursor: pointer;
              }
              .highlight-button:hover,
              .delete-button:hover {
                color: #fff;
                background-color: #5865f2;
              }
              .attachment-link {
                display: block;
                color: #7289da;
                text-decoration: underline;
              }
              .footer {
                font-family: Arial, Helvetica, sans-serif font-size 14px;
                text-align: center;
                position: static;
                border: 5px solid #443e44;
                margin-top: 10px;
            }
            
            .footer-img {
                margin: -70px 600px;
                width: 75px;
                height: 75px;
            }
            </style>
          </head>
          <body>
            <div class="transcript">
              ${transcriptContent.join("\n")}
            </div>
            <script>
              document.addEventListener("DOMContentLoaded", () => {
                const highlightButtons = document.querySelectorAll(".highlight-button");
                highlightButtons.forEach((button) => {
                  button.addEventListener("click", () => {
                    const parent = button.parentElement.parentElement;
                    parent.style.backgroundColor = "#5865f2";
                    parent.style.color = "#fff";
                  });
                });

                const deleteButtons = document.querySelectorAll(".delete-button");
                deleteButtons.forEach((button) => {
                  button.addEventListener("click", () => {
                    const index = button.dataset.index;
                    const messageItem = document.getElementById("message-" + index);
                    messageItem.remove();
                  });
                });
              });
            </script>
          </body>
          <div class="footer">
            <img src="https://dev.pogy.gg/favicon.ico" alt="Pogy" width="75" height="75">
            <p>v2.Pogy.xyz</p>
            <p>© 2021 Pogy.xyz. All rights reserved.</p>
            <p3>Made with ❤️ by Hotsuop</p3>
          </div>
        </html>
      `;

      const filePath = path.join(__dirname, "transcript.html");
      fs.writeFileSync(filePath, htmlContent);

      if (!fs.existsSync(filePath)) {
        return message.reply("Error: Transcript file not found.");
      }

      const attachment = new MessageAttachment(filePath, "transcript.html");
      await message.channel.send({ content: "Transcript generated!", files: [attachment] });

      fs.unlinkSync(filePath);

    } catch (error) {
      console.error(error);
      message.reply("Failed to generate transcript.");
    }
  }

  escapeHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
};



/* Coded by hotsuop with ❤️

© 2021 Pogy.xyz. All rights reserved. */