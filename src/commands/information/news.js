const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Pogy");
const Guildd = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.suppressDeprecationWarnings = true;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "news",
      description: `Shows Pogy's latest news`,
      category: "Information",
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({});

    const guildDB2 = await Guildd.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB2.language}.json`);

    if (!guildDB) return message.channel.sendCustom(`${language.noNews}`);

    let embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`Pogy News`)
      .setDescription(
        `***__${language.datePublished}__ ${moment(guildDB.time).format(
          "dddd, MMMM Do YYYY"
        )}*** *__[\`(${moment(
          guildDB.time
        ).fromNow()})\`](https://394wkx-3000.csb.app/)__*\n\n ${guildDB.news}`
      )
      .setFooter({ text: "https://394wkx-3000.csb.app//" })
      .setTimestamp();

    message.channel.sendCustom({ embeds: [embed] }).catch(() => {
      message.channel.sendCustom(`${language.noNews}`);
    });
  }
};
