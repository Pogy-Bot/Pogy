const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "dashboard",
      description: "Need a way to get the bot's dashboard link but don't know it? Use this to get it!",
      category: "Information",
      cooldown: 3,
    });
  }
  async run(message) {
    const dashembed = new MessageEmbed()
    .setTitle("Need the bot's dashboard link? Here you go!")
    .setDescription("https://v2.pogy.xyz")
    .setColor("RANDOM")
    .setFooter({ text: `Requested by ${message.author.username}` })
    .setTimestamp();
    message.channel.sendCustom({ embeds: [dashembed] });
  }
}
