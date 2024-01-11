const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const User = require("../../database/schemas/User");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("vote")
  .setDescription("Pogys vote page"),
  async execute(interaction) {
    let user = await User.findOne({
      discordId: interaction.user.id
    });

    if (!user) {
      const newUser = new User({
        discordId: interaction.user.id
      });

      await newUser.save().catch(() => {});
      user = await User.findOne({
        discordId: interaction.user.id
      });
    }

    let DBL_INTERVAL = 43200000;
    let lastVoted = user && user.lastVoted ? user.lastVoted : 0;
    let checkDBLVote = Date.now() - lastVoted < DBL_INTERVAL;

    await interaction.reply({
      embeds: [
        new MessageEmbed()
.setDescription(`__**discordbotlist.com**__\n${checkDBLVote ? `\`In ${ms(user.lastVoted - Date.now() + DBL_INTERVAL, { long: true })}\`` : "[`Available Now!`](https://discordbotlist.com/bots/Pogy-3175)"}\n\n__**Rewards:**__\n`)
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setColor(interaction.guild.me.displayHexColor)
        .setFooter({ text: "https://Pogy.ml" })
        .setTimestamp(),
      ],
    });
  }
};
