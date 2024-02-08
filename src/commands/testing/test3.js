const Command = require("../../structures/Command");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageAttachment,
} = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const fs = require("fs");
const path = require("path");
const emojis = require("../../assets/emojis.json");

function checkDays(date) {
  let now = new Date();
  let diff = now.getTime() - date.getTime();
  let days = Math.floor(diff / 86400000);
  return days + (days == 1 ? " day" : " days") + " ago";
}

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "serverinfo2",
      aliases: ["server", "si", "guildinfo", "info"],
      description: "Displays information about the current server.",
      category: "Information",
      guildOnly: true,
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });


    const embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription("this is a test")
     
      .setThumbnail(message.guild.iconURL())
      .setColor(message.guild.me.displayHexColor);

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("test")
        .setLabel("testinng")
        .setStyle("SUCCESS")
        .setEmoji(`${emojis.utility}`)
    );

    const sentMessage = await message.channel.sendCustom({
      embeds: [embed],
      components: [row],
    });


    const collector = sentMessage.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      const htmlContent = `meow
      `;

      sentMessage.edit({ components: [] });
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        sentMessage.edit({ components: [] });
      }
    });
  }
};
