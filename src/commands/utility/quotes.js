const { CommandInteraction, MessageEmbed } = require("discord.js");
const Quote = require("../../database/models/quote.js");
const Command = require("../../structures/Command");
const Canvas = require("canvas");
const Discord = require("discord.js");
const backgroundImage = "https://cdn.discordapp.com/attachments/1182740493277331468/1195538918855168060/pexels-aleksandar-pasaric-2341830.jpg";

module.exports = class ShowQuotesCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "quotes",
      aliases: ["quotelist2"],
      description: "Show saved quotes from the server database",
      category: "General",
      cooldown: 5,
    });
  }

  async run(interaction) {
    try {
      // Fetch quotes from the database for the current server
      const quotes = await Quote.find({
        serverID: interaction.guildId,
      });

      if (quotes.length === 0) {
        return interaction.reply("No quotes found for this server.");
      }

      // Create an embed to display quotes
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Saved Quotes");

      quotes.forEach((quote) => {
        embed.addField(
          `${quote.authorID}`,
          `*${quote.content}*\n\n[${quote.authorID}](${quote.authorAvatar})`
        );
      });

      const quote = quotes[Math.floor(Math.random() * quotes.length)];

      const canvas = Canvas.createCanvas(1000, 500);
      const ctx = canvas.getContext("2d");

      // Log the image URL for debugging
      console.log("Background Image URL:", backgroundImage);

      // Draw a background image
      const background = await Canvas.loadImage(backgroundImage);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Draw a semi-transparent overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      ctx.font = "40px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("Saved Quotes", canvas.width / 2, 50);

      ctx.font = "28px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.fillText(`Content: ${quote.content}`, 50, canvas.height / 2);
      ctx.fillText(`Author: ${quote.authorID}`, 50, canvas.height / 2 + 40);

      // Draw a circular avatar
      /* ctx.beginPath();
      ctx.arc(850, 125, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();*/
    /*   const avatarImage = await Canvas.loadImage(quote.authorAvatar); 
      ctx.drawImage(avatarImage, 750, 25, 200, 200); */

      const attachment = new Discord.MessageAttachment(
        canvas.toBuffer(),
        "quote.png"
      );
      await interaction.reply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error(error);
      await interaction.reply("An error occurred while fetching quotes.");
    }
  }
};
