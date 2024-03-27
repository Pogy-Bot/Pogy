const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "dashboard",
      description:
        "Need a way to get the bot's dashboard link but don't know it? Use this to get it!",
      category: "Information",
      cooldown: 3,
      aliases: ["dashboard", "dash"],
    });
  }
  async run(message) {
    // add a button
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Dashboard")
        .setStyle("LINK")
        .setURL("https://v2.pogy.xyz")
    );

    const dashembed = new MessageEmbed()
      .setTitle("Need the bot's dashboard link? Here you go!")
      .setDescription("https://v2.pogy.xyz")
      .setColor("RANDOM")
      .setFooter({ text: `Requested by ${message.author.username}` })
      .setTimestamp();
    message.channel.send({ embeds: [dashembed], components: [row] });
  }
};
