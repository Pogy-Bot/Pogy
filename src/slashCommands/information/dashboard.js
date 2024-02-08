const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("dashboard")
  .setDescription("Need help getting to the dashboard of Pogy? Use this command!"),
  async execute(interaction) {
    const dashembed = new MessageEmbed()
    .setTitle("Need Pogy's dashboard link?")
    .setDescription("Click [here](https://v2.pogy.xyz) to see Pogy's dashboard")
    .setColor("RANDOM")
    .setFooter({ text: `Requested by ${interaction.author}` })
    .setTimestamp();
    interaction.reply({ embeds: [dashembed], ephemeral: true });
  }
}
