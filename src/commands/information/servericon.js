const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "servericon",
      aliases: ["sicon"],
      description: "Display's the current Server Icon",
      category: "Information",
      cooldown: 3,
    });
  }

  async run(message) {
    const embed = new MessageEmbed()
      .setAuthor(
        `${message.guild.name}'s Server Icon`,
        " ",
        message.guild.iconURL({ dynamic: true, size: 512 })
      )
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter({
        text: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.sendCustom({ embeds: [embed] });
  }
};
