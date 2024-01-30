const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "bean",
      aliases: [],
      description: "Beans a user",
      category: "Moderation",
      cooldown: 3,
    });
  }

  async run(message, args) {
    try {
      const logging = await Logging.findOne({
        guildId: message.guild.id,
      });

      const member = message.mentions.members.first();
      const reason = args.slice(1).join(" ");

      if (!member) {
        let usernotfound = new MessageEmbed()
          .setColor(message.client.color.red)
          .setDescription(
            `${message.client.emoji.fail} | I couldn't find that user.`,
          )
          .setTimestamp();

        return message.channel.sendCustom({ embeds: [usernotfound] });
      }

      if (member.id === message.author.id) {
        let beanselferror = new MessageEmbed()
          .setColor(message.client.color.red)
          .setDescription(
            `${message.client.emoji.fail} | <@${message.author.id}>, You can't bean yourself.`,
          );

        return message.channel.sendCustom({ embeds: [beanselferror] });
      }

      if (
        member.roles.highest.position >= message.member.roles.highest.position
      ) {
        let rolesmatch = new MessageEmbed()
          .setColor(message.client.color.red)
          .setDescription(
            `${message.client.emoji.fail} | They have more power than you or have equal power as you do!`,
          )
          .setTimestamp();

        return message.channel.sendCustom({ embeds: [rolesmatch] });
      }

      let embed = new MessageEmbed()
        .setColor("BLURPLE")
        .setDescription(
          `${message.client.emoji.success} | <@${member.id}> has been **beaned** | \`${reason || `You have been beaned by ${message.author.tag}`}\``,
        )
        .setTimestamp();

      return message.channel.sendCustom({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.sendCustom({
        content: `An error occurred while processing the command.`,
      });
    }
  }
};
