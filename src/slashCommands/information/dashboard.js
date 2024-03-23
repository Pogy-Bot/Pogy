const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("dashboard")
  .setDescription("Need help getting to the dashboard of MEE8? Use this command!"),
  async execute(interaction) {
    const dashembed = new MessageEmbed()
    .setTitle("Need MEE8's dashboard link?")
    .setDescription("Click [here](https://g5qzg2-5003.csb.app) to see MEE8's dashboard")
    .setColor("RANDOM")
    .setFooter({ text: `Requested by ${interaction.author}` })
    .setTimestamp();
    interaction.reply({ embeds: [dashembed], ephemeral: true });
  }
}
