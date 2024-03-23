const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Quote = require("../../database/models/quote.js");

module.exports = class QuoteCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "quote",
      description: "Save a quote in the server database",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message, args) {
    try {
      const content = args.join(" ");

      if (!content) {
        return message.channel.send("Please provide the content of the quote.");
      }

      const serverID = message.guild.id;
      const userID = message.author.id;
      const author = message.author
      const authorID = message.author.id;
      const authorAvatar = message.author.displayAvatarURL();

      // Save the quote to the database
      await Quote.create({
        serverID,
        userID,
        author,
        content,
        authorID,
        authorAvatar,
      });

      message.channel.send('Quote saved successfully!');
    } catch (error) {
      console.error(error);
      message.channel.send('An error occurred while saving the quote.');
    }
  }
};
