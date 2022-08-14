const discord = require("discord.js");
const Command = require("../../structures/Command");
const ReactionMenu = require("../../data/ReactionMenu.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "youngest",
      aliases: ["young"],
      usage: "<date>",
      category: "Alt Detector",
      examples: ["youngest 30"],
      description: "Find all youngest alts with the provided join date (days)",
      cooldown: 10,
      userPermission: ["MANAGE_GUILD"],
    });
  }
  async run(message, args) {
    const client = message.client;

    let days = args[0];
    if (!days)
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | Please provide a valid Days Duration`
            ),
        ],
      });

    if (isNaN(days))
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | Please provide a valid Days Duration`
            ),
        ],
      });

    let day = Number(days);

    if (day > 100)
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | You may only find alts of an account age of **100 days** or below`
            ),
        ],
      });

    let array = [];

    message.guild.members.cache.forEach(async (user) => {
      let x = Date.now() - user.joinedAt;
      let created = Math.floor(x / 86400000);

      if (day > created) {
        array.push(
          `${user} (${user.user.tag} | ${user.id})\nJoined At: **${user.joinedAt}**`
        );
      }
    });

    const interval = 10;

    const embed = new discord.MessageEmbed()
      .setTitle(`Alt Detector - Join age < ${days} Days`)
      .setDescription(array.join("\n\n") || "No alts found")
      .setColor(message.client.color.green);

    if (array.length <= interval) {
      message.channel.sendCustom(
        embed
          .setTitle(`Alt Detector - Join age < ${days} Days`)
          .setDescription(array.join("\n\n"))
      );
    } else {
      embed.setTitle(`Alt Detector - Join age < ${days} Days`).setFooter({
        text: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      new ReactionMenu(
        message.client,
        message.channel,
        message.member,
        embed,
        array,
        interval
      );
    }
  }
};
