const Event = require("../../structures/Event");
const Discord = require("discord.js");
const config = require("../../../config.json");
const webhookClient = new Discord.WebhookClient({ url: config.webhooks.errors });

module.exports = class extends Event {
  async run(error, message) {
    console.error(error);

    if (
      message.channel &&
      message.channel.viewable &&
      message.channel
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    ) {
      message.channel
        .sendCustom(
          `${message.client.emoji.fail} Hey pogger! An Error just occured, make sure to report it here ${config.discord}!`
        )
        .catch(() => {});
    }

    webhookClient.send(
      `${message.author.username} (${message.author.id})\n${message.content}\n${error}`
    );
  }
};
