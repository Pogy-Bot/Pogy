const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");


module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "channelinfo", 
      aliases: [], 
      description: "get channel info",
      category: "General",
      cooldown: 5,
   
    });
  }

  async run(message) {
    try {
    const channel2 = message.mentions.channels.first() || message.channel;
    const embed = new MessageEmbed()
    .addFields(
        { name: "Channel Mention", value: `${channel2}`, inline: true },
        { name: "Channel ID", value: `${channel2.id}`, inline: true },
        { name: "Channel Name", value: `${channel2.name}`, inline: true },
        { name: "Channel Type", value: `${channel2.type}`, inline: true },
        { name: "Channel Topic", value: `${channel2.topic}`, inline: true },
        { name: "Channel Position", value: `${channel2.position}`, inline: true },
        { name: "Channel NSFW", value: `${channel2.nsfw}`, inline: true },
        { name: "Channel Created At", value: `${channel2.createdAt}`, inline: true },
        { name: "Channel Bitrate", value: `${channel2.bitrate}`, inline: true },
        { name: "Channel User Limit", value: `${channel2.userLimit}`, inline: true },
    )
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()
    .setColor("RANDOM")
    .setThumbnail(channel2.guild.iconURL());


    message.channel.send({embeds: [embed]});
    
      
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};