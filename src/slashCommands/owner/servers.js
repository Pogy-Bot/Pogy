const { SlashCommandBuilder } = require("@discordjs/builders");
const ReactionMenu = require("../../data/ReactionMenu.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("servers")
  .setDescription("View every server the bot is in"),
  async execute(interaction) {
    const servers = interaction.client.guilds.cache.map((guild) => {
      return `\`${guild.id}\` - ${guild.name} - \`${guild.memberCount}\` members`;
    });

    if(!interaction.client.config.developers.includes(interaction.member.id)) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | You are not a developer of this bot.`)
        ], ephemeral: true
      })
    }

    const embed = new MessageEmbed()
    .setTitle("Server List")
    .setFooter({
     text: interaction.member.displayName,
      iconURL: interaction.member.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp()
    .setColor(interaction.guild.me.displayHexColor)

    if (servers.length <= 50) {
      const range = servers.length == 1 ? "[1]" : `[1 - ${servers.length}]`;
      embed.setTitle(`Server List ${range}`).setDescription(servers.join("\n"))
        interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      interaction.reply({ content: `I am currently in ${servers.length} servers.` })
      new ReactionMenu(
        interaction.client,
        interaction.channel,
        interaction.member,
        embed,
        servers
      );
    }
  }
};