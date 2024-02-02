const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
module.exports = class EmojiInfoCommand extends Command {
 constructor(...args) {
    super(...args, {
      name: "emojiinfo",
      description: "Provides information about an emoji.",
      category: "General",
      cooldown: 5,
    });
 }

 async run(message, prefix) {
    try {
      // Adjusted regex to capture both emoji name and ID
      const regex = /(?<=<:)(.*?)(?::\d+>)/;
      const match = regex.exec(message.content);

      if (!match) {
        return message.channel.send(`Please specify an emoji after the prefix (e.g., ${prefix}emojiinfo CuteCatUwU)`);
      }

      const emojiName = match[1].trim(); // Trim whitespace

      const emoji = message.guild.emojis.cache.find((e) => e.name === emojiName);

      if (!emoji) {
        return message.channel.send(`Emoji not found. Is it on this server?`);
      }
      const infobed = new MessageEmbed()
 .setColor("BLURPLE")
 .setTitle(`Emoji Info`)
 .addFields(
    { name: "**Emoji URL**", value: `${emoji.url}`},
    { name: "**Created at**", value: `${emoji.createdAt}`, inline: true },
    { name: "**Emoji ID**", value: `${emoji.id}`, inline: true },
    { name: "**Available on:**", value: `${emoji.name}`, inline: true },
    { name: "**Animated:**", value: emoji.animated ? "Yes" : "No", inline: true },
    { name: "**Managed:**", value: emoji.managed ? "Yes" : "No", inline: true },
    { name: "**Available:**", value: emoji.available ? "Yes" : "No", inline: true }
 )
 .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
      const infoMessage = `**Emoji Name:** ${emoji.name}\n**ID:** ${emoji.id}\n**URL:** ${emoji.url}\n**Created At:** ${emoji.createdAt}\n`;

      await message.channel.send({ embeds: [infobed] });;
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred. Please try again later.");
    }
 }
};
// Made by hotsuop ending a 10-hour code streak