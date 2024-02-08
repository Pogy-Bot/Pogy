// ProfileCommand.js
const Command = require("../../structures/Command");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = class ProfileCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "profile",
      aliases: ["myprofile"],
      description: "View or update your profile.",
      category: "User",
      cooldown: 5,
    });
  }

  async run(message, args) {
    try {
      // Load existing profiles from JSON file
      let profiles = {};
      if (fs.existsSync("/home/vboxuser/Pogy-3/src/data/profiles.json")) {
        const data = fs.readFileSync("/home/vboxuser/Pogy-3/src/data/profiles.json");
        profiles = JSON.parse(data);
      }

      // Get member ID
      const memberId = message.author.id;

      // Check if the member has a profile
      if (!profiles[memberId]) {
        // Create a new profile if not exists
        profiles[memberId] = {
          username: message.author.username,
          points: 0,
          // Add more profile fields as needed
        };
      }

      // Display the member's profile card
      const profileEmbed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Profile`)
        .addField("Points")
        // Add more fields as needed
        .setColor("#3498db"); // Set the embed color

      message.channel.send(profileEmbed);

      // Save updated profiles to JSON file
      fs.writeFileSync("profiles.json", JSON.stringify(profiles, null, 2));
    } catch (error) {
      console.error("Error in the profile command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
