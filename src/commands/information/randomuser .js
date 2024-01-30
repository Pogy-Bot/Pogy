const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Command = require("../../structures/Command");

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
    const userembed = new MessageEmbed()
      .setTitle("Random User")
      .setDescription(`**User:** <@${user.user.id}>`)
      .setColor("RANDOM")
      .setFooter({ text: `Requested by ${message.author.username}` });

    const rerolebtn = new MessageButton()
      .setCustomId("rerole")
      .setLabel("Rerole")
      .setStyle("PRIMARY")
      .setEmoji("🔄");

    const rerole = new MessageActionRow().addComponents(rerolebtn);

    message.channel.send({ embeds: [userembed], components: [rerole] });
  }
};