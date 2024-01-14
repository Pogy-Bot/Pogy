const Command = require("../../structures/Command");
const { MessageEmbed, Interaction } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "randomuser",
      aliases: ["random", "rand", "ru"],
      usage: "[user]",
      description: "Ping a random user from the server",
      category: "Utility",
      cooldown: 3,
    });
  }

  async run(message, args) {
    // Check if message has a guild first
    if (!message.guild) return;

    const members = message.guild.members.cache;
    const user = members.random();
    message.channel.send(`<@${user.user.id}>`);
  }
};
