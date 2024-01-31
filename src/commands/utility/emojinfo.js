const Command = require("../../structures/Command");

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
      const regex = /(?<=<:)(.*?)(?=>)/; 
      const match = regex.exec(message.content);

      if (!match) {
        return message.channel.send(`Please specify an emoji after the prefix (e.g., ${prefix}emojiinfo CuteCatUwU)`);
      }

      const emojiName = match[1];

      const emoji = message.guild.emojis.cache.find((e) => e.name === emojiName);

      if (!emoji) {
        return message.channel.send(`Emoji not found. is it on this server?` );
      }


      const infoMessage = `**Emoji Name:** ${emoji.name}\n**ID:** ${emoji.id}\n**URL:** ${emoji.url}\n**Created At:** ${emoji.createdAt}\n`;

      await message.channel.send(infoMessage);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
// made by hotsuop ending a 10 hour code streak