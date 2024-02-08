const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
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
      name: "serverinfo",
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

    const language = require(`../../data/language/${guildDB.language}.json`);

    const embed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .addField(`${language.nameS}`, `${message.guild.name}`, true)
      .addField("ID", `${message.guild.id}`, true)
      .addField(
        `${language.serverInfo1}`,
        `${message.guild.members.cache.size} | ${
          message.guild.members.cache.filter((member) => !member.user.bot).size
        } | ${
          message.guild.members.cache.filter((member) => member.user.bot).size
        }`,
        true
      )
      .addField(
        `${language.verificationLevel}`,
        message.guild.verificationLevel,
        true
      )
      .addField(`${language.channels}`, `${message.guild.channels.cache.size}`, true)
      .addField(`${language.roleCount}`, `${message.guild.roles.cache.size}`, true)
      .addField(
        `Created at`,
        `${message.channel.guild.createdAt
          .toUTCString()
          .substr(0, 16)} **(${checkDays(message.channel.guild.createdAt)})**`,
        true
      )
      .setThumbnail(message.guild.iconURL())
      .setColor(message.guild.me.displayHexColor);

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('showServerImage')
          .setLabel('Export to HTML')
          .setStyle('SUCCESS')
          .setEmoji(`${emojis.utility}`)
      );

    const sentMessage = await message.channel.sendCustom({ embeds: [embed], components: [row] });

    const filter = i => i.customId === 'showServerImage' && i.user.id === message.author.id;

    const emojisList = message.guild.emojis.cache.map(emoji => `<li>${emoji.name}: <img src="${emoji.url}" /></li>`).join('');

    const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <title>Server Stats - ${message.guild.name}</title>
            <style>
            body {
              color: #e2dddd;
              text-align: start;
              font-family: Arial, sans-serif;
              background-color: rgb(21, 23, 26);
              background: linear-gradient(90deg, rgb(14, 13, 26) 0%, rgb(18, 12, 26) 35%, rgb(14, 13, 26) 100%);
          }
          
          li {
              font-size: medium;
              margin-bottom: 10px;
              color: #e2dddd;
              text-align: start;
              font-family: Arial, sans-serif;
          }
          
          li:hover {
              color: #2323c2;
          }
            </style>
          </head>
          <body>
            <h1>${message.guild.name} - Server Stats</h1>
            <p>Some server statistics:</p>
            <ul>
              <li><strong>Server Name:</strong> ${message.guild.name}</li>
              <li><strong>ID:</strong> ${message.guild.id}</li>
              <li><strong>Member Count:</strong> ${message.guild.members.cache.size}</li>
              <li><strong>Bot Count:</strong>  ${message.guild.members.cache.filter((member) => member.user.bot).size}</li>
              <li><strong>Text Channel Count:</strong> ${message.guild.channels.cache.filter((channel) => channel.type === 'text').size}</li>
              <li><strong>Voice Channel Count:</strong> ${message.guild.channels.cache.filter((channel) => channel.type === 'voice').size}</li>
              <li><strong>Role Count:</strong> ${message.guild.roles.cache.size}</li>
              <li><strong>Created At:</strong> ${message.guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(message.guild.createdAt)})</li>
              <li><strong>Region:</strong> ${message.guild.region}</li>
              <li><strong>Verification Level:</strong> ${message.guild.verificationLevel}</li>
              <li><strong>Boost Count:</strong> ${message.guild.premiumSubscriptionCount}</li>
              <li><strong>Boost Tier:</strong> ${message.guild.premiumTier}</li>
              <li><strong>Boosters:</strong> ${message.guild.premiumSubscriptionCount}</li>
              <li><strong>Emojis:</strong> ${message.guild.emojis.cache.size}</li>
              <li><strong>Roles:</strong> ${message.guild.roles.cache.size}</li>
              <li><strong>Rules channel:</strong> ${message.guild.rulesChannelID? `<#${message.guild.rulesChannelID}>` : 'None'}</li>
              <li><strong>Public updates channel:</strong> ${message.guild.publicUpdatesChannelID? `<#${message.guild.publicUpdates.channelID}>` : 'None'}</li>
              <li><strong>System channel:</strong> ${message.guild.systemChannelID? `<#${message.guild.systemChannelID}>` : 'None'}</li>
              <li><strong>AFK Channel:</strong> ${message.guild.afkChannelID? `<#${message.guild.afk.channelID}>` : 'None'}</li>
              <li><strong>AFK Timeout:</strong> ${message.guild.afkTimeout} seconds</li>
              <li><strong>Owner:</strong> ${message.guild.owner}</li>
              <li><strong>Owner ID:</strong> ${message.guild.ownerID}</li>
              <li><strong>Icon:</strong> <img src="${message.guild.iconURL()}" /></li>
              <li><strong>Splash:</strong> <img src="${message.guild.splashURL()}" /></li>
              <li><strong>Banner:</strong> <img src="${message.guild.bannerURL()}" /></li>
              <li><strong>Default Message Notification:</strong> ${message.guild.defaultMessageNotifications}</li>
              <li><strong>Explicit Content Filter:</strong> ${message.guild.explicitContentFilter}</li>
              <li><strong>MFA Level:</strong> ${message.guild.mfaLevel}</li>
              <li><strong>Widget Channel:</strong> ${message.guild.widgetChannelID? `<#${message.guild.widgetChannelID}>` : 'None'}</li>
              <li><strong>Widget Enabled:</strong> ${message.guild.widgetEnabled? 'Yes' : 'No'}</li>
              <li><strong>Widget Server:</strong> ${message.guild.widgetEnabled? message.guild.widget.server : 'None'}</li>
              <li><strong>Widget Channel:</strong> ${message.guild.widgetEnabled? message.guild.widget.channel : 'None'}</li>
              <li><strong>Widget Role:</strong> ${message.guild.widgetEnabled? message.guild.widget.role : 'None'}</li>

            </ul>
          </body>
        </html>
      `;

      const filePath = path.join(__dirname, `${message.guild.name}_server_stats.html`);

      fs.writeFileSync(filePath, htmlContent);

      if (!fs.existsSync(filePath)) {
        return message.reply("Error: Server stats file not found.");
      }

      const attachment = new MessageAttachment(filePath, `${message.guild.name}_server_stats.html`);
      await message.reply({ files: [attachment] });

      fs.unlinkSync(filePath);

      sentMessage.edit({ components: [] });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        sentMessage.edit({ components: [] });
      }
    });
  }
};
