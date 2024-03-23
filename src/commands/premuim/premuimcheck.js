const discord = require("discord.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "premiumcheck",
      aliases: ["pc"],
      category: "Premium",
      description: "Check if the server is premium",
      cooldown: 5,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);
    const client = message.client;

    // Check if the server is premium or not
    if (guildDB.isPremium === "true") {
      message.channel.send("The server is premium!");
    } else {
      message.channel.send("The server is not premium!");
    }
  }
};