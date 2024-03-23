const Command = require("../../structures/Command");
const userData = require("../../data/users.json");
const fs = require("fs");
const guildData = require("../../data/users.json");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "setbackground",
      description: "Set your preferred background.",
      category: "Leveling",
      cooldown: 3,
      usage: "<background URL>",
      guildOnly: true,
    });
  }

  run(message, args) {
    const backgroundURL = args[0];
    const targetUser = message.mentions.users.first() || message.author;
    const guild = message.guild;
    const user = userData.guilds[guild.id].users[targetUser.id];
    if (guildData[guild.id] && guildData[guild.id].levelingEnabled === false) {
      return message.reply("Leveling is disabled for this server.");
    }

    if (!backgroundURL) {
      return message.reply("Please provide a background URL.");
    }

    const userId = message.author.id;
    userData.users[userId].background = backgroundURL;

    // Save updated data back to the JSON file
    fs.writeFile(
      "./src/data/users.json",
      JSON.stringify(userData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return message.reply(
            "An error occurred while saving the background preference.",
          );
        }
        message.reply("Background preference saved successfully!");
      },
    );
  }
};
