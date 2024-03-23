// FindMessagesCommand.js
const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");
module.exports = class FindMessagesCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "findmessages",
      aliases: ["fm"], // You can add aliases as needed
      description: "Find messages from a user containing a keyword in a given time range",
      category: "Moderation", // Adjust the category as needed
      cooldown: 5,
      usage: "/findmessages <@user> <keyword> <time>",
      permissions: ["MANAGE_MESSAGES"], // Add any required permissions
    });
  }

  async run(message, args) {
    try {
      // Get mentioned user
      const user = message.mentions.users.first();
      if (!user) {
        return message.reply("Please mention a user.");
      }

      // Get keyword and time range
      const keyword = args[1];
      const time = args[2];

      if (!keyword || !time || isNaN(time)) {
        return message.reply("Please provide a keyword and a valid time in minutes.");
      }

      // Calculate the timestamp for the start of the time range
      const startTime = new Date(Date.now() - time * 60 * 1000);

      // Fetch messages from the channel
      const messages = await message.channel.messages.fetch({ limit: 100 });

      // Filter messages based on user and keyword
      const matchingMessages = messages.filter((msg) => {
        return (
          msg.author.id === user.id &&
          msg.content.toLowerCase().includes(keyword.toLowerCase()) &&
          msg.createdTimestamp >= startTime
        );
      });

      // Create an embed to display the results
      const embed = new MessageEmbed()
        .setColor("#3498db")
        .setTitle(`Messages from ${user.tag} containing "${keyword}" in the last ${time} minutes`);

      if (matchingMessages.size === 0) {
        embed.setDescription("No matching messages found.");
      } else {
        embed.setDescription(matchingMessages.map((msg) => `${msg.content}\n`).join("\n"));
      }

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in the findmessages command:", error);
      message.reply("An error occurred. Please try again later.");
    }
  }
};
