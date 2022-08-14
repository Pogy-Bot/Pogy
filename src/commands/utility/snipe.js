const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Snipe = require("../../database/schemas/snipe");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "snipe",
      description: "Snipe Messages in the channel",
      category: "Utility",
      usage: ["snipe"],
      cooldown: 5,
    });
  }

  async run(message) {
    let channel = message.mentions.channels.first();
    if (!channel) channel = message.channel;

    const snipe = await Snipe.findOne({
      guildId: message.guild.id,
      channel: channel.id,
    });

    const no = new MessageEmbed()
      .setAuthor(
        `#${channel.name} | ${message.guild.name}`,
        message.guild.iconURL()
      )
      .setFooter({ text: message.guild.name })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(
        `${message.client.emoji.fail} | Couldn't find any deleted message in **${channel.name}**`
      );

    if (!snipe) {
      return message.channel.sendCustom(no);
    }

    if (snipe.message.length < 1) {
      return message.channel.sendCustom(no);
    }

    const data = [];

    const embed = new MessageEmbed()
      .setAuthor(
        `#${channel.name} | ${message.guild.name}`,
        message.guild.iconURL()
      )
      .setFooter({ text: message.guild.name })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    for (let i = 0; snipe.message.length > i; i++) {
      data.push(
        `**${i + 1}-**\n**User:** ${
          (await message.client.users.fetch(snipe.tag[i])) || "Unknown"
        }\n**Message:** ${snipe.message[i] || "None"}\n**image:** \`${
          snipe.image[i] || "none"
        }\``
      );

      embed.addField(
        `Message ${i + 1}`,
        `**User:** ${
          (await message.client.users.fetch(snipe.tag[i])) || "Unknown"
        }\n**Message:** ${snipe.message[i] || "None"}\n**image:** \`${
          snipe.image[i] || "none"
        }\``,
        true
      );
    }

    if (data.length < 1) return message.channel.sendCustom(no);

    message.channel.sendCustom({ embeds: [embed] }).catch(async () => {
      await snipe.deleteOne().catch(() => {});
      message.channel.sendCustom(
        `The embed contained a huge field that couldn't fit as this is the reason i failed to send the embed. I have resetted the database as you can try rerunning the command again.`
      );
    });
  }
};
