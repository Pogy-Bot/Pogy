const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "quote",
      description: "Make a quoted text!",
      category: "Fun",
      cooldown: 3,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.channel.sendCustom(`${language.managemessages}`);

    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != "GUILD_TEXT" || !channel.viewable)
      return message.channel.sendCustom(`${language.notaccessible}`);

    if (!args[0]) return message.channel.sendCustom(`${language.whatdoIsay}`);

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(["SEND_MESSAGES"]))
      return message.channel.sendCustom(`${language.sendmessages}`);

    if (!channel.permissionsFor(message.member).has(["SEND_MESSAGES"]))
      return message.channel.sendCustom(`${language.userSendMessages}`);
    const msg = message.content.slice(
      message.content.indexOf(args[0]),
      message.content.length
    );
    channel.sendCustom(`>>> ${msg}`, { disableMentions: "everyone" }).catch(() => {});
  }
};
