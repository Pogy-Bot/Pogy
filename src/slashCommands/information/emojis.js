const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const ReactionMenu = require("../../data/ReactionMenu.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("emojis")
  .setDescription("Check the current emojis of a guild"),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const emojis = [];
    interaction.guild.emojis.cache.forEach((e) => emojis.push(`\u0009 ${e} **-** \`:${e.name}:\``));

    const embed = new MessageEmbed()
    .setAuthor(`${interaction.guild.name}'s Emojis`, interaction.guild.iconURL({ dynamic: true }))
    .setTitle(`${language.emoji1}`)
    .setFooter({
      text: interaction.user.tag,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp()
    .setColor(interaction.guild.me.displayHexColor);

    const interval = 25;
    if (emojis.length === 0)
    interaction.reply({
      embeds: [
        embed.setDescription(`${language.emoji2}`)
      ] 
    });
    else if (emojis.length <= interval) {
      const range = emojis.length == 1 ? "[1]" : `[1 - ${emojis.length}]`;
      interaction.reply({ content: `This guild has ${emojis.length} emojis.`, ephemeral: true, embeds: [embed.setAuthor(`${interaction.guild.name}'s Emojis`, interaction.guild.iconURL({ dynamic: true })).setTitle(`${language.emoji1} ${range}`).setDescription(emojis.join("\n"))]});
    } else {
      interaction.reply({ content: `This guild has ${emojis.length} emojis.` })
        .then(async () => {
        setTimeout(() => {
          interaction.deleteReply().catch(() => {})
        }, 10000)
      });
      embed.setAuthor({ name: `${language.emoji1}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

      new ReactionMenu(
        interaction.client,
        interaction.channel,
        interaction.member,
        embed,
        emojis,
        interval
      );
    }
  }
};