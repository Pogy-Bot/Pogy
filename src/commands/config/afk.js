const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const afk = require("../../database/models/afk.js");

const discord = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "afk",
      aliases: [],
      description: "Set an AFK message!",
      category: "Config",
      usage: ["<reason>"],
      examples: ["afk Have to go!"],
      cooldown: 20,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const oldNickname = message.member.nickname || message.author.username;
    const nickname = `[AFK] ${oldNickname}`;
    const userr = message.mentions.users.first();
    if (userr) return message.channel.sendCustom(`${language.afk1}`);
    let everyoneping = args.indexOf("@everyone") > -1;
    if (everyoneping === true)
      return message.channel.sendCustom(`${language.afk2}`);
    if (args.length > 100) {
      message.channel.sendCustom(`${language.afk3}`);
    }
    const content = args.join(" ") || "AFK";

    const afklist = await afk.findOne({ userID: message.author.id });

    await message.member.setNickname(nickname).catch(() => {});

    if (!afklist) {
      const newafk = new afk({
        userID: message.author.id,
        serverID: message.guild.id,
        reason: content,
        oldNickname: oldNickname,
        time: new Date(),
      });

      const embed = new discord.MessageEmbed()
        .setDescription(`${language.afk5} ${content}`)
        .setColor(message.guild.me.displayHexColor)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        );
      message.channel.sendCustom({ embeds: [embed] });
      newafk.save().catch((err) => console.error(err));
    }
  }
};
