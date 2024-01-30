// LevelingToggleCommand.js

const Command = require("../../structures/Command");
const fs = require("fs");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "levelingtoggle",
      description: "Enable or disable leveling for this server.",
      category: "Leveling",
      cooldown: 3,
      usage: "<enable/disable>",
      args: true,
    });
  }

  async run(message, args) {
    const guildId = message.guild?.id;

    if (!guildId) {
      return message.reply("Guild ID is undefined.");
    }

    // Load the guild data
    const guildDataPath = "/workspaces/Pogy/src/data/users.json";
    let guildData = {};

    try {
      guildData = require(guildDataPath);
    } catch (error) {
      console.error("Error loading guild data:", error);
      return message.reply("Error loading guild data. Please try again later.");
    }

    // Check if the guild is defined in the data
    if (!guildData[guildId]) {
      guildData[guildId] = {};
    }

    // Check if levelingEnabled property is defined
    if (guildData[guildId].levelingEnabled === undefined) {
      guildData[guildId].levelingEnabled = true;
    }

    // Check if args is not empty
    if (!args || args.length === 0) {
      return message.reply("Invalid action. Use `enable` or `disable`.");
    }

    const action = args[0].toLowerCase();

    // Update the guild's levelingEnabled property
    if (action === "enable") {
      guildData[guildId].levelingEnabled = true;
      message.reply("Leveling system enabled for this server.");
    } else if (action === "disable") {
      guildData[guildId].levelingEnabled = false;
      message.reply("Leveling system disabled for this server.");
    } else {
      return message.reply("Invalid action. Use `enable` or `disable`.");
    }

    // Save the updated guild data back to the JSON file
    fs.writeFileSync(guildDataPath, JSON.stringify(guildData, null, 2));
  }
};
