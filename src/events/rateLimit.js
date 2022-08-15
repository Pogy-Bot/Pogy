const Event = require("../structures/Event");
const logger = require("../utils/logger");
const Discord = require("discord.js");
const config = require("../../config.json");
const webhookClient = new Discord.WebhookClient({
  url: config.webhooks.ratelimit_logs,
});

module.exports = class extends Event {
  async run(rl) {
    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(
        `**Time out**\n\`${rl.timeout}ms\`\n**Limit:**\n\`${rl.limit}\`\n\n__**Information**__\n**Method:**${rl.method}\n\n**Path:**\n${rl.path} ${rl.route}`
      )
      .setTimestamp();

    setTimeout(function () {
      webhookClient.sendCustom(embed);
      logger.info(`Time out: ${rl.timeout}ms. Limit: ${rl.limit}`, {
        label: "Rate Limit",
      });
    }, rl.timeout + 10);
  }
};
