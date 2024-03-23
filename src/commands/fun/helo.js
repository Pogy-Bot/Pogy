const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "helo",
      aliases: [],
      description: "Says hello to eYuM",
      category: "Fun", // Adjust the category as needed
      cooldown: 3,
    });
  }

  async run(message) {
    try {
      message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setDescription(
              `helo <@1067137336674107453> <:TrollHappy:1058938513946591292>`,
            )
            .setColor("BLURPLE"),
        ],
      });
    } catch (error) {
      console.error(error);
      message.channel.sendCustom({
        content: `An error occurred while processing the command.`,
      });
    }
  }
};
