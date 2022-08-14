const afk = require("../../database/models/afk");
const moment = require("moment");
const discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const Blacklist = require("../../database/schemas/blacklist");
const customCommand = require("../../database/schemas/customCommand");
const autoResponse = require("../../database/schemas/autoResponse");
const autoResponseCooldown = new Set();
const inviteFilter = require("../../filters/inviteFilter");
const linkFilter = require("../../filters/linkFilter");
const Maintenance = require("../../database/schemas/maintenance");
const config = require("../../../config.json");
require("moment-duration-format");

module.exports = function (client) {
  client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;
    if (
      message.editedAt &&
      message.editedAt.toISOString() !== message.createdAt.toISOString()
    )
      return;

    const settings = await Guild.findOne(
      {
        guildId: message.guild.id,
      },
      async (err, guild) => {
        try {
          if (!guild) {
            await Guild.create({
              guildId: message.guild.id,
              prefix: config.prefix,
              language: "english",
            });
          }
        } catch (e) {
          //no
        }
      }
    );

    if (!settings) return;

    const mentionRegexPrefix = RegExp(`^<@!?${client.user.id}>`);

    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    const userBlacklistSettings = await Blacklist.findOne({
      discordId: message.author.id,
    });
    const guildBlacklistSettings = await Blacklist.findOne({
      guildId: message.guild.id,
    });
    //autoResponse

    const autoResponseSettings = await autoResponse.findOne({
      guildId: message.guild.id,
      name: message.content.toLowerCase(),
    });

    if (autoResponseSettings && autoResponseSettings.name) {
      if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;
      if (maintenance && maintenance.toggle == "true") return;
      if (autoResponseCooldown.has(message.author.id))
        return message.channel.sendCustom(
          `${message.client.emoji.fail} Slow Down - ${message.author}`
        );

      message.channel.sendCustom(
        autoResponseSettings.content

          .replace(/{user}/g, `${message.author}`)

          .replace(/{user_tag}/g, `${message.author.tag}`)
          .replace(/{user_name}/g, `${message.author.username}`)
          .replace(/{user_ID}/g, `${message.author.id}`)
          .replace(/{guild_name}/g, `${message.guild.name}`)
          .replace(/{guild_ID}/g, `${message.guild.id}`)
          .replace(/{memberCount}/g, `${message.guild.memberCount}`)
          .replace(/{size}/g, `${message.guild.memberCount}`)
          .replace(/{guild}/g, `${message.guild.name}`)
          .replace(
            /{member_createdAtAgo}/g,
            `${moment(message.author.createdTimestamp).fromNow()}`
          )
          .replace(
            /{member_createdAt}/g,
            `${moment(message.author.createdAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}`
          )
      );

      autoResponseCooldown.add(message.author.id);
      setTimeout(() => {
        autoResponseCooldown.delete(message.author.id);
      }, 2000);

      return;
    }

    //afk
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    // Filters
    if (guildDB && (await inviteFilter(message))) return;
    if (guildDB && (await linkFilter(message))) return;

    let language = require(`../../data/language/english.json`);

    if (guildDB)
      language = require(`../../data/language/${guildDB.language}.json`);

    if (message.mentions.members.first()) {
      if (maintenance && maintenance.toggle == "true") return;
      const afklist = await afk.findOne({
        userID: message.mentions.members.first().id,
        serverID: message.guild.id,
      });
      if (afklist) {
        await message.guild.members.fetch(afklist.userID).then((member) => {
          let user_tag = member.user.tag;
          return message.channel
            .sendCustom(
              `**${afklist.oldNickname || user_tag || member.user.username}** ${
                language.afk6
              } ${afklist.reason} **- ${moment(afklist.time).fromNow()}**`
            )
            .catch(() => {});
        });
      }
    }

    const afklis = await afk.findOne({
      userID: message.author.id,
      serverID: message.guild.id,
    });

    if (afklis) {
      if (maintenance && maintenance.toggle == "true") return;
      let nickname = `${afklis.oldNickname}`;
      message.member.setNickname(nickname).catch(() => {});
      await afk.deleteOne({ userID: message.author.id });
      return message.channel
        .sendCustom(
          new discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${language.afk7} ${afklis.reason}`)
        )
        .then((m) => {
          setTimeout(() => {
            m.delete().catch(() => {});
          }, 10000);
        });
    }

    let mainPrefix = settings ? settings.prefix : config.prefix;

    const prefix = message.content.match(mentionRegexPrefix)
      ? message.content.match(mentionRegexPrefix)[0]
      : mainPrefix;

    const [cmd] = message.content.slice(prefix.length).trim().split(/ +/g);

    if (!message.content.startsWith(prefix)) return;
    if (guildBlacklistSettings && guildBlacklistSettings.isBlacklisted) return;

    // Custom Commands
    const customCommandSettings = await customCommand.findOne({
      guildId: message.guild.id,
      name: cmd.toLowerCase(),
    });

    const customCommandEmbed = await customCommand.findOne({
      guildId: message.guild.id,
      name: cmd.toLowerCase(),
    });

    if (
      customCommandSettings &&
      customCommandSettings.name &&
      customCommandSettings.description
    ) {
      if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;

      let embed = new MessageEmbed()
        .setTitle(customCommandEmbed.title)
        .setDescription(customCommandEmbed.description)
        .setFooter(``);

      if (customCommandEmbed.image !== "none")
        embed.setImage(customCommandEmbed.image);
      if (customCommandEmbed.thumbnail !== "none")
        embed.setThumbnail(customCommandEmbed.thumbnail);

      if (customCommandEmbed.footer !== "none")
        embed.setFooter(customCommandEmbed.footer);
      if (customCommandEmbed.timestamp !== "no") embed.setTimestamp();
      if (customCommandEmbed.color == "default") {
        embed.setColor(message.guild.me.displayHexColor);
      } else embed.setColor(`${customCommandEmbed.color}`);

      return message.channel.sendCustom(embed);
    }

    if (
      customCommandSettings &&
      customCommandSettings.name &&
      !customCommandSettings.description &&
      customCommandSettings.json == "false"
    ) {
      if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;
      return message.channel.sendCustom(
        customCommandSettings.content

          .replace(/{user}/g, `${message.author}`)

          .replace(/{user_tag}/g, `${message.author.tag}`)
          .replace(/{user_name}/g, `${message.author.username}`)
          .replace(/{user_ID}/g, `${message.author.id}`)
          .replace(/{guild_name}/g, `${message.guild.name}`)
          .replace(/{guild_ID}/g, `${message.guild.id}`)
          .replace(/{memberCount}/g, `${message.guild.memberCount}`)
          .replace(/{size}/g, `${message.guild.memberCount}`)
          .replace(/{guild}/g, `${message.guild.name}`)
          .replace(
            /{member_createdAtAgo}/g,
            `${moment(message.author.createdTimestamp).fromNow()}`
          )
          .replace(
            /{member_createdAt}/g,
            `${moment(message.author.createdAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}`
          )
      );
    }

    if (
      customCommandSettings &&
      customCommandSettings.name &&
      !customCommandSettings.description &&
      customCommandSettings.json == "true"
    ) {
      if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) return;
      const command = JSON.parse(customCommandSettings.content);
      return message.channel.sendCustom(command).catch((e) => {
        message.channel.sendCustom(
          `There was a problem sending your embed, which is probably a JSON error.\nRead more here --> https://pogy.xyz/embeds\n\n__Error:__\n\`${e}\``
        );
      });
    }
  });
};
