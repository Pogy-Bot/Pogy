// PollCommand.js
const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");

module.exports = class PollCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "poll",
      aliases: [],
      description: "Start or show a poll.",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message, args) {
    try {
      // Check if the server is premium
      const guildDB = await Guild.findOne({
        guildId: message.guild.id,
      });
      
      if (!guildDB) {
        return message.channel.send("Error fetching server information.");
      }

      const isPremium = guildDB.isPremium === "true";

      // Parse command arguments
      const command = args[0];
      const pollMessage = args.slice(1).join(" ");

      if (command === "show") {
        // Show the poll based on message ID or link
        const pollID = args[1];
        const pollMessage = await this.getExistingPoll(pollID);
        return message.channel.send(pollMessage);
      } else if (command === "start") {
        // Parse choices from the message content
        const choices = this.parseChoices(pollMessage);

        // Check if the user has premium for extended choices
        const maxChoices = isPremium ? 20 : 10;

        if (choices.length > maxChoices) {
          return message.channel.send(`You can only have a maximum of ${maxChoices} choices.`);
        }

        // Create and send the poll message
        const pollEmbed = this.createPollEmbed(choices);
        const pollMessage = await message.channel.send(pollEmbed);

        // Add reactions to the choices
        for (let i = 0; i < choices.length; i++) {
          await pollMessage.react(`${i + 1}\u20e3`); // React with number emojis
        }

        return message.channel.send(`Poll started!`);
      } else {
        return message.channel.send("Invalid poll command. Use `start` or `show`.");
      }
    } catch (error) {
      console.error("Error in the poll command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }

  parseChoices(pollMessage) {
    // Extract choices from the message content
    const choices = pollMessage.match(/"([^"]*)"/g);

    if (!choices) {
      throw new Error("Invalid poll format. Provide choices in double quotes.");
    }

    return choices.map((choice) => choice.slice(1, -1)); // Remove quotes
  }

  createPollEmbed(choices) {
    // Create an embed with poll choices
    const embed = new MessageEmbed()
      .setTitle("Poll")
      .setDescription(choices.map((choice, index) => `${index + 1}. ${choice}`).join("\n"))
      .setColor("#3498db");

    return embed;
  }

  async getExistingPoll(pollID) {
    // Fetch the poll message using ID or link
    const pollMessage = await message.channel.messages.fetch(pollID, false).catch(() => null);

    if (!pollMessage) {
      throw new Error("Poll not found. Please provide a valid message ID or link.");
    }

    return pollMessage.content;
  }
};
