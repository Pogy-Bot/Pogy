const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const ReactionRole = require("../../packages/reactionrole/models/schema");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "rrwipe",
      aliases: ["reactionrolewipe", "reactionroleswipe"],
      description: "Wipe all reaction Roles from the current guild",
      category: "Reaction Role",
      cooldown: 3,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message) {
    const conditional = {
      guildid: message.guild.id,
    };
    const results = await ReactionRole.find(conditional);

    if (results && results.length) {
      for (const result of results) {
        try {
          await result.deleteOne();
        } catch (e) {
          console.log(e);
        }
      }
    }

    let resultsHeheLol = results.length;
    let resultsHehe = `reaction roles`;
    if (resultsHeheLol == "1") resultsHehe = "reaction role";

    if (resultsHeheLol === "0" || !results || !results.length) {
      let wipeEmbed3 = new MessageEmbed()
        .setColor(message.client.color.green)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`The Current Guild has no Existing Reaction Roles!`)
        .setFooter({ text: "https://pogy.xyz/" });

      message.channel.sendCustom(wipeEmbed3);

      return;
    }

    let wipeEmbed = new MessageEmbed()
      .setColor(message.client.color.green)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `Successfuly deleted **${results.length}** ${resultsHehe}`
      )
      .setFooter({ text: "https://pogy.xyz/" });

    message.channel.sendCustom(wipeEmbed);
  }
};
