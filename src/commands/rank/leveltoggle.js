// LevelingToggleCommand.js

const Command = require("../../structures/Command");
const fs = require("fs");
const userData = require("../../data/users.json");
let toggle = true;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "leveltoggle",
      description: "Enable or disable leveling for this server.",
      category: "Leveling",
      cooldown: 3,
      usage: "<enable/disable>",
      args: true,
    });
  }

  async run(message, args) {
    const guildId = message.guild.id;

    if (!guildId) {
      return message.reply("Guild ID is undefined.");
    }

    // Check if args is not empty
    if (!args || args.length === 0) {
      return message.reply("Invalid action. Use `enable` or `disable`.");
    }

    const action = args[0].toLowerCase();

    // Update the guild's levelingEnabled property
    if (action === "enable") {
      toggle = true;
      userData.guilds[guildId].levelingEnabled = toggle;
      message.reply("Leveling system enabled for this server.");
    } else if (action === "disable") {
      toggle = false;
      userData.guilds[guildId].levelingEnabled = toggle;
      message.reply("Leveling system disabled for this server.");
    } else {
      return message.reply("Invalid action. Use `enable` or `disable`.");
    }
    fs.writeFileSync("./src/data/users.json", JSON.stringify(userData));
  }
};
