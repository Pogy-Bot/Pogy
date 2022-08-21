const discord = require("discord.js");
const Command = require("../../structures/Command");
const Paste = require("../../database/models/transcript.js");
const ReactionMenu = require("../../data/ReactionMenu.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "review",
      aliases: ["reviewapps", "reviewapplication", "reviewapplications"],
      usage: "",
      category: "Applications",

      description: "Approve an application in the guild.",
      cooldown: 5,
      userPermission: ["MANAGE_GUILD"],
    });
  }
  async run(message) {
    const conditional = {
      type: "form",
      status: null,
    };
    const results = await Paste.find(conditional);
    if (!results.length) {
      return message.channel.send("There are no applications to review.");
    }
    const array = [];
    if (results && results.length) {
      for (const result of results) {
        try {
          const member = await message.guild.members.fetch(result.by);

          array.push(
            `Application #${result._id} | Submitter: ${member.user.tag}`
          );
        } catch (err) {
          //nothing}
        }
      }
      const interval = 15;

      const embed = new discord.MessageEmbed()
        .setTitle(`Applications - Review`)
        .setDescription(
          `\`\`\`\n${array.join("\n\n")}\`\`\`` ||
            "No Pending Applications Found"
        )
        .setColor(message.client.color.green)
        .setFooter({
          text: message.author.tag,
          ixonURL: message.author.displayAvatarURL({ dynamic: true }),
        });

      if (array.length <= interval) {
        const range = array.length == 1 ? "[1]" : `[1 - ${array.length}]`;
        message.channel.sendCustom(
          embed
            .setTitle(`Applications - Review ${range}`)
            .setDescription(
              `\`\`\`\n${array.join("\n\n")}\`\`\`` ||
                "No Pending Applications Found"
            )
            .setColor(message.client.color.green)
            .setFooter({
              text: message.author.tag,
              ixonURL: message.author.displayAvatarURL({ dynamic: true }),
            })
        );
      } else {
        embed.setTitle(`Applications - Review`).setFooter({
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
  }
};
