const Command = require("../../structures/Command");

const { MessageEmbed } = require("discord.js");
const User = require("../../database/schemas/User");
const ms = require("ms");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "vote",
      description: "Pogys vote pages",
      category: "Utility",
      cooldown: 5,
    });
  }

  async run(message) {
    let user = await User.findOne({
      discordId: message.author.id,
    });

    if (!user) {
      const newUser = new User({
        discordId: message.author.id,
      });

      await newUser.save().catch(() => {});
      user = await User.findOne({
        discordId: message.author.id,
      });
    }

    let DBL_INTERVAL = 43200000;
    let lastVoted = user && user.lastVoted ? user.lastVoted : 0;
    let checkDBLVote = Date.now() - lastVoted < DBL_INTERVAL;

    await message.channel.sendCustom({
      embeds: [
        new MessageEmbed()
          .setDescription(
            `__**Top.gg**__\n${
              checkDBLVote
                ? `\`In ${ms(user.lastVoted - Date.now() + DBL_INTERVAL, {
                    long: true,
                  })}\``
                : "[`Available Now!`](https://top.gg/bot/767705905235099658/vote)"
            }\n\n__**Rewards:**__\n`
          )
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setColor(message.guild.me.displayHexColor)
          .setFooter({ text: "https://394wkx-3000.csb.app//" })
          .setTimestamp(),
      ],
    });
  }
};
