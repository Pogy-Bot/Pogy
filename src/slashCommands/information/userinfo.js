const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const User = require("../../database/schemas/User");
const Nickname = require("../../database/schemas/nicknames");
const Usernames = require("../../database/schemas/usernames");
const moment = require("moment");
const emojis = require("../../assets/emojis.json");

const flags = {
  DISCORD_EMPLOYEE: `${emojis.discord_employee} \`Discord Employee\``,
  DISCORD_PARTNER: `${emojis.discord_partner} \`Partnered Server Owner\``,
  BUGHUNTER_LEVEL_1: `${emojis.bughunter_level_1} \`Bug Hunter (Level 1)\``,
  BUGHUNTER_LEVEL_2: `${emojis.bughunter_level_2} \`Bug Hunter (Level 2)\``,
  HYPESQUAD_EVENTS: `${emojis.hypesquad_events} \`HypeSquad Events\``,
  HOUSE_BRAVERY: `${emojis.house_bravery} \`House of Bravery\``,
  HOUSE_BRILLIANCE: `${emojis.house_brilliance} \`House of Brilliance\``,
  HOUSE_BALANCE: `${emojis.house_balance} \`House of Balance\``,
  EARLY_SUPPORTER: `${emojis.early_supporter} \`Early Supporter\``,
  TEAM_USER: "Team User",
  SYSTEM: "System",
  VERIFIED_BOT: `${emojis.verified_bot} \`Verified Bot\``,
  VERIFIED_DEVELOPER: `${emojis.verified_developer} \`Early Verified Bot Developer\``,
  ACTIVE_DEVELOPER: `${emojis.active_developer} \`Active Developer\``,
};

module.exports = {
  data: new SlashCommandBuilder()
  .setName("userinfo")
  .setDescription("View the info of a user")
  .addUserOption((option) => option.setName("member").setDescription("The member")),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    let member = interaction.options.getMember("member") || interaction.member;

    if(!member) {
      try {
        member = await interaction.guild.members.fetch(member);
      } catch {
        member = interaction.member;
      }
    }

    /* if(!member.user) return interaction.reply(language.userinfo.no_user); */

    let userFind = await User.findOne({
      discordId: member.id,
    });

    if (!userFind) {
      const newUser = new User({
        discordId: member.id,
      });

      newUser.save();
      userFind = await User.findOne({
        discordId: member.id,
      });
    }
    let badge;
    if (userFind && userFind.badges) {
      badge = userFind.badges.join(" ");
      if (!badge || !badge.length) badge = `\`None\``;
    } else {
      badge = `\`None\``;
    }

    let usernames = [];

    // user tags
    let userName = await Usernames.findOne({
      discordId: member.id,
    });
    if (!userName) {
      const newUser = new Usernames({
        discordId: member.id,
      });

      newUser.save();

      usernames = `No Tags Tracked`;
    } else {
      usernames = userName.usernames.join(" - ");
      if (!userName.usernames.length) usernames = `No Tags Tracked`;
    }

    let nickname = [];

    // user nicknames
    const nicknames = await Nickname.findOne({
      discordId: member.id,
      guildId: interaction.guild.id,
    });
    if (!nicknames) {
      const newUser = new Nickname({
        discordId: member.id,
        guildId: interaction.guild.id,
      });

      newUser.save();

      nickname = `No Nicknames Tracked`;
    } else {
      nickname = nicknames.nicknames.join(" - ");
      if (!nicknames.nicknames.length) nickname = `No Nicknames Tracked`;
    }

    const userFlags = (await member.user.fetchFlags()).toArray();

    // Trim roles
    let rolesNoob;
    let roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);

    rolesNoob = roles.join(" ");
    if (member.roles.cache.size < 1) rolesNoob = "No Roles";

    if (!member.roles.cache.size || member.roles.cache.size - 1 < 1)
      roles = `\`None\``;
    const embed = new MessageEmbed()
    .setAuthor({
      name: `${member.user.tag}`,
      iconURL: member.user.displayAvatarURL({ dynamic: true })
    })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `ID: ${member.id}` })
    .setTimestamp()
    .setColor(member.displayHexColor)
    .setDescription(
      `**• ${language.userh}** \`${member.user.username}\` | \`#${
        member.user.discriminator
      }\`\n** • ID:** \`${member.id}\`\n**• ${
        language.joinedDiscord
      }** \`${moment(member.user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}\`\n**• ${language.joinedServer}** \`${moment(member.joinedAt).format("MMMM Do YYYY, h:mm:ss a")}\`\n**• Roles [${roles.length || "0"}]: ** ${
        rolesNoob || `\`${language.noRoles}\``
      }\n\n**• ${language.badgeslmao}** ${userFlags.map((flag) => flags[flag]).join("\n") || `\`${language.noBadge}\``}\n**• ${language.botBadges}** ${
        badge || `\`None\``
      }\n**• Last 5 Nicknames:**\n\`\`\`${
        nickname || `No Nicknames Tracked`
      }\`\`\`**• Last 5 Tags:**\n\`\`\`${
        usernames || `No Tags Tracked`
      }\`\`\` `
    );

      interaction.reply({ embeds: [embed] });
  }
};