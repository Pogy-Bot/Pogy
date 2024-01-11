// EmoteAddCommand.js
const Command = require("../../structures/Command");

module.exports = class EmoteAddCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "emoteadd",
      description: "Adds an emote to the server.",
      category: "Emotes",
      cooldown: 5,
      userPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
      botPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
      args: [
        {
          key: "name",
          prompt: "Enter a name for the emote.",
          type: "string"
        },
        {
          key: "url",
          prompt: "Provide the image URL of the emote.",
          type: "string"
        }
      ]
    });
  }

  async run(message, args) {
    try {
      const { name, url } = args;

      if (!name || !url) {
        return message.reply("Please provide both the emote name and the image URL.");
      }

      const guild = message.guild;
      const fetchedEmotes = guild.emojis.cache;

      const emoteName = name.trim();

      if (fetchedEmotes.some((emote) => emote.name === emoteName)) {
        return message.reply(`An emote with the name \`${emoteName}\` already exists in the server.`);
      }

      const emote = await guild.emojis.create(url, emoteName);
      message.channel.send(`Emote ${emote} with name \`${emoteName}\` has been added to the server.`);
    } catch (error) {
      console.error("Error occurred:", error.message);
      message.reply("Failed to add the emote. Please check the image URL and try again.");
    }
  }
};
