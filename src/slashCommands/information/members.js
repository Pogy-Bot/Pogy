const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const ReactionMenu = require("../../data/ReactionMenu.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("members")
  .setDescription("Check members of a certain role or every member")
  .addRoleOption((option) => option.setName("role").setDescription("The role to check").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    let prefix = "/";
    
    let role = interaction.options.getRole("role")

    let embedValid = new MessageEmbed()
    .setAuthor({
      name: interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true })
    })
    .setDescription(`${language.members2.replace(/{prefix}/g, `${prefix}`)}`)
    .setFooter({ text: "https://Pogy.ml/" })
    .setColor(interaction.guild.me.displayHexColor);

    if(!role) return interaction.reply({ embeds: [embedValid] });
    
    const memberRole = role;

    const members = interaction.guild.members.cache.filter((m) => {
      if (m.roles.cache.find((r) => r === memberRole)) return true;
    })
    .sort((a, b) => (a.joinedAt > b.joinedAt ? 1 : -1))
    .map((m) => `${m.user.tag} - ${m.joinedAt.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`);

    const embed = new MessageEmbed()
    .setTitle(`${capitalize(role.name)} ${language.list} [${members.length}]`)
    .setFooter({
      text: interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true })
    })
    .setTimestamp()
    .setColor(interaction.guild.me.displayHexColor);

    const interval = 25;
    if (members.length === 0)
      interaction.reply({
        embeds: [
          embed.setDescription(
            `${language.members1.replace(
            "{cap}",
            `${capitalize(role.name)}`
          )}`
        )
      ]
    });
    else if (members.length <= interval) {
      const range = members.length == 1 ? "[1]" : `[1 - ${members.length}]`;
      interaction.reply({
        embeds: [
          embed.setTitle(`${capitalize(role.name)} ${language.list} ${range}`)
          .setDescription(members.join("\n"))
        ]
      });

      // Reaction Menu
    } else {
      embed.setTitle(`${capitalize(role.name)} ${language.list}`)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });

      interaction.reply({ content: `The message has been sent below.`, ephemeral: true })

      new ReactionMenu(
        interaction.client,
        interaction.channel,
        interaction.member,
        embed,
        members,
        interval
      );
    }
  }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}