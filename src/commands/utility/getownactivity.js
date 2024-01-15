const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const convertSvgToPng = require("convert-svg-to-png");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "getactivity",
      description: "Get Discord activity",
      category: "Utility",
      cooldown: 5,
      usage: "[user_mention_or_id]",
      args: false,
    });
  }

  async run(message, args) {
    let userId;

    if (args.length > 0) {
      const mention = args[0];
      const userIdMatch = mention.match(/^<@!?(\d+)>$/);

      if (userIdMatch) {
        userId = userIdMatch[1];
      } else {
        userId = mention;
      }
    } else {
      userId = message.author.id;
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

      const svgImage = await response.text();
      const link = response.url;

      // Convert SVG to PNG
      const pngBuffer = await convertSvgToPng.convert(svgImage, {
        height: 250,
        width: 512,
      });
      const attachment = new MessageAttachment(pngBuffer, "user_activity.png");

      // Create and send the embed with the converted image
      const embed = new MessageEmbed()
        .setTitle("Discord Activity")
        .setDescription(`[Click here to view the activity](${link})`)
        .setColor("#7289DA")
        .setImage(`attachment://user_activity.png`); // Attach the image to the embed

      message.reply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error("Error fetching user activity:", error);
      message.reply("Failed to fetch user activity.");
    }
  }
};
