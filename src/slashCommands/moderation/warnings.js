const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const Guild = require("../../database/schemas/Guild.js");
const warnModel = require("../../database/models/moderation.js");
const ReactionMenu = require("../../data/ReactionMenu.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("warnings")
  .setDescription("Shows the warnings for a user")
  .addUserOption((option) => option.setName("member").setDescription("The member").setRequired(true)),
  async execute(interaction) {
    let client = interaction.client;

    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });
    let language = require(`../../data/language/${guildDB.language}.json`);

    if(!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });

    const mentionedMember = interaction.options.getMember("member")

    const warnDoc = await warnModel
    .findOne({
      guildID: interaction.guild.id,
      memberID: mentionedMember.id,
    })
    .catch((err) => console.log(err));

    if (!warnDoc || !warnDoc.warnings.length) {
      return interaction.reply({ embeds: [
        new MessageEmbed()
          .setDescription(
            `${interaction.client.emoji.fail} | **${mentionedMember.user.tag}** ${language.warningsNoError}`
        )
          .setTimestamp()
          .setColor(client.color.red),
        ],
      });
    }

    const data = [];

    for (let i = 0; warnDoc.warnings.length > i; i++) {
      data.push(
        `**Moderator:** ${await interaction.client.users.fetch(
          warnDoc.moderator[i]
        )}\n**Reason:** ${warnDoc.warnings[i]}\n**Date:** ${moment(
          warnDoc.date[i]
        ).format("dddd, MMMM do YYYY")}\n**Warning ID:** ${i + 1}\n`
      );
    }

    const count = warnDoc.warnings.length;

    const embed = new MessageEmbed()
    .setTimestamp()
    .setColor(client.color.blue);

    const buildEmbed = (current, embed) => {
      const max = count > current + 4 ? current + 4 : count;
      let amount = 0;
      for (let i = current; i < max; i++) {
        if (warnDoc.warnings[i].length > 1000)
          warnDoc.warnings[i] = warnDoc.warnings[i].slice(0, 1000) + "...";
        embed
        .addField(
          "\u200b",
          `**${language.warnName || "unknown"} \`#${i + 1}\`**`
        )
        .addField(
          `${language.warnModerator || "unknown"}`,
          `${interaction.guild.members.cache.get(warnDoc.moderator[i])}`,
          true
        )

        .addField(
          `${language.warnAction || "unknown"}`,
          `${warnDoc.modType[i]}`,
          true
        )

        .addField(
          `${language.warnReason || "unknown"}`,
          `${warnDoc.warnings[i]}`,
          true
        )
        .addField(
          `${language.warnID || "unknown"}`,
          `${warnDoc.warningID[i]}`,
          true
        )
        .addField(
          `${language.warnDateIssued || "unknown"}`,
          `${moment(warnDoc.date[i]).format("dddd, MMMM Do YYYY")}`
        );
        amount += 1;
      };

      return embed
      .setTitle(`${language.warnList} [${current} - ${max}]`)
      .setDescription(
        `Showing \`${amount}\` of ${mentionedMember}'s \`${count}\` total warns.`
      );
    };

    if (count < 4) interaction.reply({ embeds: [buildEmbed(0, embed)] });
    else {
      let n = 0;
      const json = embed
      .setFooter({
        text: `${language.warnExpire}\n` + interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL({ dynamic: true })
      })
      .toJSON();

      const first = () => {
        if (n === 0) return;
        n = 0;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const previous = () => {
        if (n === 0) return;
        n -= 4;
        if (n < 0) n = 0;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const next = () => {
        const cap = count - (count % 4);
        if (n === cap || n + 4 === count) return;
        n += 4;
        if (n >= count) n = cap;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const last = () => {
        const cap = count - (count % 4);
        if (n === cap || n + 4 === count) return;
        n = cap;
        if (n === count) n -= 4;
        return buildEmbed(n, new MessageEmbed(json));
      };

      const reactions = {
        "⏪": first,
        "◀️": previous,
        "⏹️": null,
        "▶️": next,
        "⏩": last,
      };

      const menu = new ReactionMenu(
        interaction.client,
        interaction.channel,
        interaction.member,
        buildEmbed(n, new MessageEmbed(json)),
        null,
        null,
        reactions,
        180000
      );

      menu.reactions["⏹️"] = menu.stop.bind(menu);
    }
  },
};