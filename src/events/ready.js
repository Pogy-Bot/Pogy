const logger = require("../utils/logger"); // logger used for logs
const Event = require("../structures/Event"); /* Event file. This is used for the events
required for the bot to function correctly */
const Discord = require("discord.js");
const config = require("../../config.json");
const Guild = require("../database/schemas/Guild");
const { WebhookClient } = require("discord.js");
const premiumrip = new WebhookClient({ url: config.webhooks.premium }); // make sure webhook link is correct!!
const Message = require("../utils/other/message");
const { Handler } = require("discord-slash-command-handler");
module.exports = class extends Event {
  async run() {
    Message(this.client);

    logger.info(
      `${this.client.user.tag} is ready to serve ${this.client.guilds.cache.size} guilds with ${this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} members.`,
      { label: "Ready" }
    );

    setInterval(async () => {
      const conditional = {
        isPremium: "true",
      };
      const results = await Guild.find(conditional);

      if (results && results.length) {
        for (const result of results) {
          if (
            Number(result.premium.redeemedAt) >=
            Number(result.premium.expiresAt)
          ) {
            const guildPremium = this.client.guilds.cache.get(result.guildId);
            if (guildPremium) {
              const user = await this.client.users.cache.get(
                result.premium.redeemedBy.id
              );

              if (user) {
                const embed = new Discord.MessageEmbed()
                  .setColor(this.client.color.red)
                  .setDescription(
                    `Hey ${user.username}, Premium in ${guildPremium.name} has Just expired :(\n\n__You can you re-new your server here! [https://pogy.xyz/premium](https://pogy.xyz/premium)__\n\nThank you for purchasing premium Previously! We hope you enjoyed what you purchased.\n\n**- Pogy**`
                  );

                user.send({ embeds: [embed] }).catch(() => {});
              }

              const rip = new Discord.MessageEmbed()
                .setDescription(
                  `**Premium Subscription**\n\n**Guild:** ${
                    guildPremium.name
                  } | **${guildPremium.id}**\nRedeemed by: ${
                    user.tag || "Unknown"
                  }\n**Plan:** ${result.premium.plan}`
                )
                .setColor("RED")
                .setTimestamp();

              await premiumrip
                .sendCustom({
                  username: "Pogy Loose Premium",
                  avatarURL: `${this.client.domain}/logo.png`,
                  embeds: [rip],
                })
                .catch(() => {});

              result.isPremium = "false";
              result.premium.redeemedBy.id = null;
              result.premium.redeemedBy.tag = null;
              result.premium.redeemedAt = null;
              result.premium.expiresAt = null;
              result.premium.plan = null;

              await result.save().catch(() => {});
            }
          }
        }
      }
    }, 86400000);

    if (config.dashboard === "true") {
      const Dashboard = require("../dashboard/dashboard");
      Dashboard(this.client);
    }
  }
};
