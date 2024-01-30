const { CommandInteraction, MessageEmbed } = require('discord.js');
const Quote = require("../../database/models/quote.js");
const Command = require("../../structures/Command");

module.exports = class ShowQuotesCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "showquotes",
      aliases: ["quotelist"],
      description: "Show saved quotes from the server database",
      category: "General",
      cooldown: 5,
    });
  }

  async run(interaction) {
    try {
      // Fetch quotes from the database
      const quotes = await Quote.find({ serverID: interaction.guildId });

      if (quotes.length === 0) {
        return interaction.reply("No quotes found.");
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

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('An error occurred while fetching quotes.');
    }
  }
};
