const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const darkpassword = require("generate-password");
const Logging = require("../../database/schemas/logging");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'modnick',
      aliases: ["mod", "modnickname"],
      description: "Moderate a users nickname to make pinging possible",
      category: "Moderation",
      guildOnly: true,
      botPermission: ["MANAGE_NICKNAMES"],
      userPermission: ["MANAGE_NICKNAMES"],
      usage: "<@user> [reason]",
      examples: "modnick @Peter",
      cooldown: 30,
    });
  }

  async run(message, args) {
    const client = message.client
    const logging = await Logging.findOne({ guildId: message.guild.id });
    
    const member =
      message.mentions.members.last() ||
      message.guild.members.cache.get(args[0]);

    const reason = args.slice(1).join(" ");

    const impostorpassword = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)

    //LOGGING HERE
    if (logging) {
      if (logging.moderation.delete_after_executed === "true") {
        message.delete().catch(() => {});
      }
    }

    if(!args[0]) {
      let validmention = new MessageEmbed()
      .setColor("RED")
      .setDescription(`${client.emoji.fail} | Please mention a valid member!`)
      return message.channel.sendCustom({ embeds: [validmention] })
      .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

      if(!member) {
        let usernotfound = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${client.emoji.fail} | I can't find that member`)
        return message.channel.sendCustom({ embeds: [usernotfound] })
        .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }
    
    if(member.id === message.author.id) {
      let modnickerror = new MessageEmbed()
      .setColor("RED")
      .setDescription(`${client.emoji.fail} | You can't moderate your own nickname!`)
      return message.channel.sendCustom({ embeds: [modnickerror] })
      .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if(member.roles.highest.position >= message.member.roles.highest.position) {
      let rolesmatch = new MessageEmbed()
      .setColor("RED")
      .setDescription(`${client.emoji.fail} | They have more power than you or have equal power as you do!`)
      return message.channel.sendCustom({ embeds: [rolesmatch] })
      .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if(member) {
        const oldNickname = member.nickname || "None";
        await member.setNickname(`Moderated Nickname ${impostorpassword}`)
        let embed = new MessageEmbed()
        .setColor("BLURPLE")
        .setDescription(`${client.emoji.success} | Moderated <@${member.id}>'s nickname for \`${reason || "No Reason Provided"}\``)

        message.channel.sendCustom({ embeds: [embed] })
        .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
      }
    if(member) {
      let dmEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription(`**Nickname Moderated**\nYour nickname was moderated in **${message.guild.name}**. If you would like to change your nickname to something else, please reach out to a staff member.\n**Possible Reasons**\n• Your name was not typeable on a standard English QWERTY keyboard.\n• Your name contained words that are not suitable for the server.\n• Your name was not mentionable.\n\n__**Moderator:**__ ${message.author} **(${message.author.tag})**\n__**Reason:**__ ${reason || "No Reason Provided"}`)
      .setTimestamp()

      member.send({ embeds: [dmEmbed] })
    } else {
      let failembed = new MessageEmbed()
      .setColor(client.color.red)
      .setDescription(`${client.emoji.fail} | I can't moderate their nickname, make sure that my role is above theirs`)
      .setTimestamp()
      return message.reply({ embeds: [failembed] });
    }
  }
};
