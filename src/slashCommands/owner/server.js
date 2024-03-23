const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("server")
  .setDescription("Information of a server")
  .addStringOption((option) => option.setName("guild").setDescription("The guild ID").setRequired(true)),
  async execute(interaction) {
    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " day" : " days") + " ago";
    }
    const client = interaction.client;
    const guildId = interaction.options.getString("guild")
    const guild = interaction.client.guilds.cache.get(guildId);
    if (!guild) return interaction.reply({ content: `Invalid guild ID` });

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
    .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
    .addField("Server ID", `${guild.id}`, true)
    .addField(
      "Total | Humans | Bots",
      `${guild.members.cache.size} | ${guild.members.cache.filter((member) => !member.user.bot).size} | ${guild.members.cache.filter((member) => member.user.bot).size}`, true
    )
    .addField("Verification Level", `${guild.verificationLevel}`, true)
    .addField("Channels", `${guild.channels.cache.size}`, true)
    .addField("Roles", `${guild.roles.cache.size}`, true)
    .addField(
      "Creation Date",
      `${guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(
        guild.createdAt
      )})`,
      true
    )
    .setThumbnail(guild.iconURL())
    .setColor(interaction.guild.me.displayHexColor);
    interaction.reply({ embeds: [embed] }).catch((error) => { 
      interaction.reply({ content: `Error: ${error}`})
    });
  }
};