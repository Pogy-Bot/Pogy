const Command = require("../../structures/Command");
const Premium = require("../../database/schemas/GuildPremium");
const discord = require("discord.js");
const moment = require("moment");

var voucher_codes = require("voucher-code-generator");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "addpremium",
      aliases: ["apremium"],
      description: "Add a premium code.",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const plans = ["month", "year"];

    if (!args[0])
      return message.channel.sendCustom(
        `Provide a Plan!\n${plans.join(" - ")}`
      );

    if (!plans.includes(args[0]))
      return message.channel.sendCustom(
        `Provide a Plan!\n${plans.join(" - ")}`
      );

    let expiresAt;

    if (args[0] === "month") {
      expiresAt = Date.now() + 2592000000;
    } else if (args[0] === "year") {
      expiresAt = Date.now() + 2592000000 * 12;
    }

    let amount = args[1];
    if (!amount) amount = 1;

    const array = [];
    for (var i = 0; i < amount; i++) {
      const codePremium = voucher_codes.generate({
        pattern: "####-####-####",
      });

      const code = codePremium.toString().toUpperCase();

      const find = await Premium.findOne({
        code: code,
      });

      if (!find) {
        Premium.create({
          code: code,
          expiresAt: expiresAt,
          plan: args[0],
        });

        array.push(`\`${i + 1}-\` ${code}`);
      }
    }

    message.channel.sendCustom({
      embeds: [
        new discord.MessageEmbed()
          .setColor(message.client.color.green)
          .setDescription(
            `**Generated ${array.length} Premium Code(s)**\n\n${array.join(
              "\n"
            )}\n\n**Type:** ${args[0]}\n**Expires:** ${moment(expiresAt).format(
              "dddd, MMMM Do YYYY"
            )}`
          ),
      ],
    });
  }
};
