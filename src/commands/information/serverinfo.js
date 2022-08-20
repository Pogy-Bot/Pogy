const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");

function checkDays(date) {
  let now = new Date();
  let diff = now.getTime() - date.getTime();
  let days = Math.floor(diff / 86400000);
  return days + (days == 1 ? " day" : " days") + " ago";
}

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "serverinfo",
      aliases: ["server", "si", "guildinfo", "info"],
      description: "Displays information about the current server.",
      category: "Information",
      guildOnly: true,
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const embed = new MessageEmbed()

      .setAuthor(message.guild.name, message.guild.iconURL)
      .addField(`${language.nameS}`, `${message.guild.name}`, true)
      .addField("ID", `${message.guild.id}`, true)
     
    
      .addField(
        `${language.serverInfo1}`,
        `${message.guild.members.cache.size} | ${
          message.guild.members.cache.filter((member) => !member.user.bot).size
        } | ${
          message.guild.members.cache.filter((member) => member.user.bot).size
        }`,
        true
      )
      .addField(
        `${language.verificationLevel}`,
        message.guild.verificationLevel,
        true
      )
      .addField(`${language.channels}`, `${message.guild.channels.cache.size}`, true)
      .addField(`${language.roleCount}`, `${message.guild.roles.cache.size}`, true)
      .addField(
        `Created at`,
        `${message.channel.guild.createdAt
          .toUTCString()
          .substr(0, 16)} **(${checkDays(message.channel.guild.createdAt)})**`,
        true
      )
      .setThumbnail(message.guild.iconURL())
      .setColor(message.guild.me.displayHexColor);
    message.channel.sendCustom({ embed });
  }
};
