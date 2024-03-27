const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class GetActivityCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "getactivity",
      description: "Get user's Discord activity",
      category: "Utility",
      cooldown: 5,
      usage: "<user_id>",
      args: true,
    });
  }

  async run(message, args) {
    const userId = args[0];
    const bgColor = "1b1c1e";
    const borderRadius = 0;
    const idleMessage = "I'm not doing anything";
    const hideStatus = true;

    try {
      const response = await fetch(`https://discord-activity.deno.dev/api/${userId}?bgColor=${bgColor}&borderRadius=${borderRadius}&idleMessage=${idleMessage}&hideStatus=${hideStatus}`);
      const svgImage = await response.text();

      if (!svgImage) {
        return message.channel.send("Failed to fetch user's activity.");
      }

      // Sending SVG as a Discord message
      message.channel.send({ content: `${response}` });

    } catch (error) {
      console.error("Error fetching user activity:", error);
      message.channel.send("Failed to fetch user's activity.");
    }
  }

};
