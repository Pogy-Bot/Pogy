const Command = require("../../structures/Command");
const { createCanvas, loadImage } = require('canvas');
const discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "say",
      description: "Generate an image with the provided text.",
      category: "Images",
      usage: "<text>",
      cooldown: 5,
      guildOnly: true,
    });
  }

  async run(message, args) {
    const client = message.client;

    try {
      const text = args.join(" ").trim();
      if (!text) {
        return message.channel.send({
          embeds: [
            new discord.MessageEmbed()
              .setColor(client.color.red)
              .setDescription(`${client.emoji.fail} Please provide some text.`),
          ],
        });
      }

      // Create canvas
      const canvas = createCanvas(400, 200);
      const ctx = canvas.getContext('2d');

      // Set a background color
      ctx.fillStyle = '#808080'; // Gray
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Position the text in the center
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Convert the canvas
      const attachment = new discord.MessageAttachment(canvas.toBuffer(), 'said_text.png');

      // Send the generated image
      message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error occurred:", error);
      this.client.emit("apiError", error, message);
    }
  }
};
