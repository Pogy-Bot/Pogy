const Command = require("../../structures/Command");
const fs = require("fs");

module.exports = class BadWordCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "createrole",
      aliases: ["cr"],
      description: "create a role",
      category: "Moderation",
      cooldown: 5,
      usage: "cr <roleName>",
      guildOnly: true,
      permissions: ["MANAGE_MESSAGES"],
    });
  }

  async run(message, args) {
    try {
      const roleName = args[0];0
      const color = args[1]; 
      const hoist = args[2];
      const mentionable = args[3]; 
      const permissions = args[4];

      if (!color) return message.reply("Please provide a color!");
      if (!roleName) return message.reply("Please provide a role name!");

      try {
        await message.guild.roles.create({
          name: roleName,
          hoist: hoist, 
          mentionable: mentionable, 
          color: color, 
          permissions: permissions, 
          reason: `Role created by ${message.author.tag}`, 
        });
        message.reply(`Successfully created role "${roleName}"!`);
      } catch (error) {
        console.error("Error creating role:", error);
        message.reply("An error occurred while creating the role.");
      }
    } catch (error) {
      console.error("Error in the createrole command:", error);
      message.reply("An error occurred. Please try again later.");
    }
  }
};
