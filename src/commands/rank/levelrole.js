// commands/SetLevelUpRoleCommand.js
const Command = require("../../structures/Command");
const fs = require("fs");
const path = require("path");

module.exports = class SetLevelUpRoleCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "setleveluprole",
      description: "Set the role to be given upon leveling up.",
      category: "Admin",
      cooldown: 5,
      guildOnly: true,
    });
  }

  async run(message, args) {
    const roleId = args[0];
    const level = args[1];

    if (!roleId || isNaN(level)) {
      return message.reply("Please provide a valid role ID and level.");
    }

    const guildId = message.guild.id;
    const userDataPath = path.join(__dirname, "../../data/users.json");

    // Read the current user data
    let userData = {};
    try {
      const userDataFileContent = fs.readFileSync(userDataPath, "utf-8");
      userData = JSON.parse(userDataFileContent);
    } catch (error) {
      console.error("Error reading user data file:", error);
    }

    // Update the guild configuration
    userData.guilds = userData.guilds || {};
    userData.guilds[guildId] = userData.guilds[guildId] || {};
    userData.guilds[guildId].levelUpRoles = userData.guilds[guildId].levelUpRoles || [];

    // Check if a role entry for the specified level already exists
    const existingRoleIndex = userData.guilds[guildId].levelUpRoles.findIndex(role => role.level === parseInt(level));

    if (existingRoleIndex !== -1) {
      // Update existing role entry
      userData.guilds[guildId].levelUpRoles[existingRoleIndex].roleId = roleId;
    } else {
      // Add new role entry
      userData.guilds[guildId].levelUpRoles.push({
        level: parseInt(level),
        roleId,
      });
    }

    // Write the updated user data back to the file
    try {
      const updatedUserData = JSON.stringify(userData, null, 2);
      fs.writeFileSync(userDataPath, updatedUserData, "utf-8");
    } catch (error) {
      console.error("Error writing user data file:", error);
    }

    message.reply(`Level-up role set for level ${level}: <@&${roleId}>`);
  }
};
