const Command = require("../../structures/Command");
const NewsSchema = require("../../database/schemas/Pogy");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "setnews",
      description: "This is for the developers.",
      category: "Owner",
      usage: ["<text>"],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    let news = args.join(" ").split("").join("");
    if (!news) return message.channel.send("Please enter news.");
    const newsDB = await NewsSchema.findOne({});
    if (!newsDB) {
      await NewsSchema.create({
        news: news,
        time: new Date(),
      });

      return message.channel.send("News set.");
    }

    await NewsSchema.findOneAndUpdate(
      {},
      {
        news: news,
        time: new Date(),
      }
    );
  }
};
