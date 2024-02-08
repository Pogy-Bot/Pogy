const Command = require("../../structures/Command");
const { Client, Intents } = require('discord.js');


module.exports = class AddEmojiCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "addemoji",
      description: "Adds a custom emoji to the server.",
      category: "Admin", 
      cooldown: 5,
      userPermissions: ["MANAGE_EMOJIS"], 
    });
  }

  async run(message) {
    try {

      const args = message.content.split(/\s+/);


      const emojiName = args[1];
      const emojiURL = args[2];


      if (!emojiName || !emojiURL) {
        return message.channel.send("Please provide both the name and URL of the emoji.");
      }


      const guild = message.guild;

      const existingEmoji = guild.emojis.cache.find((emoji) => emoji.name === emojiName);

      if (existingEmoji) {
        return message.channel.send(`An emoji with the name "${emojiName}" already exists in the server.`);
      }


      const addedEmoji = await guild.emojis.create(emojiURL, emojiName);


      return message.channel.send(`Emoji "${addedEmoji.name}" has been added to the server: ${addedEmoji}`);
    } catch (error) {
      console.error(error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
// made by hotsuop ending a 10 hour code streak