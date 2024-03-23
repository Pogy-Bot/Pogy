const Command = require("../../structures/Command");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = class CatCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "cat",
      aliases: ["meow"],
      description: "Displays a random cat image.",
      category: "Fun", 
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      const { data } = await axios.get("https://api.thecatapi.com/v1/images/search");

      if (!data || !Array.isArray(data) || data.length === 0) {
        return message.channel.send("Failed to fetch a cat image. Please try again later.");
      }

      const catImageUrl = data[0].url;

      const catEmbed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor || "#7289DA") 
        .setImage(catImageUrl)
        .setFooter(`Requested by: ${message.author.tag}`)
        .setDescription("Cats :cat:");
      
      
      message.channel.send({ embeds: [catEmbed] });
    } catch (error) {
      console.error("Error fetching cat image:", error);
      message.channel.send("Failed to fetch a cat image. Please try again later.");
    }
  }
};
