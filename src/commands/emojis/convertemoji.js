const Command = require("../../structures/Command");

module.exports = class MyEmojiCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "steal",
      description: "steal emojis!",
      category: "Emoji",
      cooldown: 5,
    });
  }

  async run(message, args) {
    try {

      if (args.length < 2) {
        return message.reply("Please provide both the name and url/emoji for the emoji to steal.");
      }


      const emojiName = args[0];
      const emojiRepresentation = args[1];


      const emojiId = emojiRepresentation.match(/:(\d+)>/);

      if (!emojiId || !emojiId[1]) {
        return message.reply("Invalid emoji representation. Please provide a valid custom emoji.");
      }
      const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId[1]}.png?v=1`;

      try {
        const createdEmoji = await message.guild.emojis.create(emojiUrl, emojiName);

        message.reply(`Stole: ${createdEmoji.toString()} !`);
      } catch (err) {
        console.error("Failed to create emoji:", err);
        message.reply("Failed to create the emoji. It might already exist or there might be a limit reached.");
      }
    } catch (error) {
      console.error("Error in the emoji command:", error);
      message.reply("An error occurred. Please check your input and try again.");
    }
  }
};
