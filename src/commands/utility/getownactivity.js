const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed, User } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "getactivity",
      description: "Get Discord activity",
      category: "Utility",
      cooldown: 5,
      usage: "[user_mention_or_id]",
      args: false, // Allow the command to be used without specifying a user
    });
  }

  async run(message, args) {
    let userId;

    // Check if a user mention or ID is provided as an argument
    if (args.length > 0) {
      const mention = args[0];
      const userIdMatch = mention.match(/^<@!?(\d+)>$/);

      if (userIdMatch) {
        userId = userIdMatch[1];
      } else {
        userId = mention; // Assume it's a user ID
      }
    } else {
      userId = message.author.id; // Default to the author's ID if no argument is provided
    }

    const bgColor = "1b1c1e";
    const borderRadius = 0;
    const idleMessage = "I'm not doing anything";
    const hideStatus = true;

    try {
      const response = await fetch(`https://discord-activity.deno.dev/api/${userId}?bgColor=${bgColor}&borderRadius=${borderRadius}&idleMessage=${idleMessage}&hideStatus=${hideStatus}`);

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return message.reply(`Failed to fetch user activity. (${response.status} - ${response.statusText})`);
      }

      const link = response.url;

      const embed = new MessageEmbed()
        .setTitle("Discord Activity")
        .setDescription(`[Click here to view the activity](${link})`)
        .setColor("#7289DA");

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching user activity:", error);
      message.reply("Failed to fetch user activity.");
    }
  }
};
