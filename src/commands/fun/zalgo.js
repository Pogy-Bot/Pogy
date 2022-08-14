const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");
const zalgo = require("zalgolize");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "zalgo",
      aliases: ["zalgolize"],
      description: "Make the bot zalgolize a message",
      category: "Fun",
      cooldown: 3,
    });
  }

  async run(message, args) {
    const client = message.client;
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    if (!args[0]) return message.channel.sendCustom(`${language.zalgolize}`);

    message.channel.sendCustom({
      embeds: [
        new discord.MessageEmbed()
          .setColor(client.color.blue)
          .setDescription(`\u180E${zalgo(args, 0.2, [10, 5, 10])}`),
      ],
    });
  }
};
