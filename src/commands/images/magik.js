const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "magik",
      aliases: [],
      description: "Make a magik avatar!",
      category: "Fun",
      usage: "<magik>",
      examples: ["magik"],
      guildOnly: true,
    });
  }

  async run(message) {
    const client = message.client;

    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    try {
      let msg = await message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.green)
            .setDescription(language.generating),
        ],
      });

      let user = message.mentions.users.first()
        ? message.mentions.users
            .first()
            .displayAvatarURL({ format: "png", size: 512 })
        : message.author.displayAvatarURL({ format: "png", size: 512 });
      let numb = Math.ceil(Math.random() * 10);
      const data = await fetch(
        `https://nekobot.xyz/api/imagegen?type=magik&image=${user}&intensity=${numb}`
      ).then((res) => res.json());
      msg.delete({ timeout: 500 });
      message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.blue)
            .setImage(data.message),
        ],
      });
    } catch (err) {
      console.log(`${err}, command name: magik`);
      message.channel.sendCustom(language.magikError);
    }
  }
};
