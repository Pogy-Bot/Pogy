const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const ReactionRole = require("../../packages/reactionrole/index.js");
const react = new ReactionRole();

require("dotenv").config();
react.setURL(process.env.MONGO);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "rrtypes",
      aliases: ["rrtype", "reactionroletypes"],
      description: "Enable / Disable Reaction Role DMs",
      category: "Reaction Role",
      cooldown: 3,
    });
  }

  async run(message) {
    let client = message.client;

    const embedType = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `\`Type 1\` - React adds the role, unreacting removes the role\n\`Type 2\` - Reacting will give the role but unreaction won't remove the role\n\`Type 3\` - Reacting will remove the user's role and unreacting won't give it back\n\`Type 4\` - When reacting it will remove the role, unreacting will add the role\n\`Type 5\` - Same concept as number 3 but removes the user's reaction\n\`Type 6\` - React to recieve the role and react again to remove the role`
      )
      .setFooter({ text: "https://394wkx-3000.csb.app//" })
      .setColor(client.color.red);

    message.channel.sendCustom(embedType);
  }
};
