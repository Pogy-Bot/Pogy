const Event = require("../../structures/Event");
const Discord = require("discord.js");
const logger = require("../../utils/logger");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const config = require("../../../config.json");
const welcomeClient = new Discord.WebhookClient({
  url: config.webhooks.leavesPublic,
});
const webhookClient = new Discord.WebhookClient({
  url: config.webhooks.leavesPrivate,
});
module.exports = class extends Event {
  async run(guild) {
    if (guild.name === undefined) return;
    Guild.findOneAndDelete(
      {
        guildId: guild.id,
      },
      (err) => {
        if (err) console.log(err);
        logger.info(`Left from "${guild.name}" (${guild.id})`, {
          label: "Guilds",
        });
      }
    );

    const welcomeEmbed = new Discord.MessageEmbed()
      .setColor(`RED`)
      .setTitle("Leave Server")
      .setThumbnail(`https://pogy.xyz/logo`)
      .setDescription(`Pogy left a Server!`)
      .addField(`Server Name`, `\`${guild.name}\``, true)
      .addField(`Server ID`, `\`${guild.id}\``, true)
      .setFooter({
        text: `${this.client.guilds.cache.size} guilds `,
        iconURL: "https://v2.pogy.xyz/logo.png",
      });

    welcomeClient.sendCustom({
      username: "Pogy",
      avatarURL: "https://v2.pogy.xyz/logo.png",
      embeds: [welcomeEmbed],
    });

    Logging.findOneAndDelete({
      guildId: guild.id,
    }).catch(() => {});

    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`I have left the ${guild.name} server.`)
      .setFooter({
        text: `Lost ${guild.members.cache.size - 1} members • I'm now in ${
          this.client.guilds.cache.size
        } servers..\n\nID: ${guild.id}`,
      })
      .setThumbnail(
        guild.iconURL({ dynamic: true })
          ? guild.iconURL({ dynamic: true })
          : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(
              guild.name
            )}`
      )
      .addField("Server Owner", `${guild.owner} / ${guild.ownerID}`);

    webhookClient.sendCustom({
      username: "Pogy",
      avatarURL: "https://v2.pogy.xyz/logo.png",
      embeds: [embed],
    });
  }
};
