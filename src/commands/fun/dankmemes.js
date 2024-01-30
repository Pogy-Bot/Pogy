const Command = require("../../structures/Command");
const {MessageEmbed} = require('discord.js');

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "dankmeme", 
      aliases: [], 
      description: "Empty command template.",
      category: "General",
      cooldown: 5,

    });
  }

  async run(message) {
    try {
        // fetch stuff from a url
        const fetch = require("node-fetch");
        const response = await fetch("https://cv75jg-3030.csb.app/meme/");
        const data = await response.json();
        const embed = new MessageEmbed()
        .setColor("#FF5733")
        .setTitle(data.id)
        .setImage(data.url)
        message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
