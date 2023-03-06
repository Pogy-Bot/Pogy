const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("addrole")
  .setDescription("Adds a role to a user.")
  .addUserOption((option) => option.setName("member").setDescription("The member to add the role to").setRequired(true))
  .addRoleOption((option) => option.setName("role").setDescription("The role to give").setRequired(true)),
  async execute(interaction) {
    if(!interaction.member.permissions.has("MANAGE_ROLES")) {
      return interaction.reply({ content: `You do not have permission to use this command.`, ephemeral: true });
    };
    const client = interaction.client;
    const fail = client.emoji.fail;
    const success = client.emoji.success;
    const logging = await Logging.findOne({ guildId: interaction.guild.id });

    let member = interaction.options.getMember("member");

    if(!member) {
      let usernotfound = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${fail} | Please mention a valid user`)
      .setTimestamp()
      .setFooter({ text: "https://mee8.ml/" })
      .setColor(interaction.client.color.red)
      return interaction.reply({ embeds: [usernotfound] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      let rolesmatch = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${fail} | The Provided user has an equal or higher role than you.`)
      .setTimestamp()
      .setFooter({ text: "https://mee8.ml/" })
      .setColor(interaction.client.color.red)
      return interaction.reply({ embeds: [rolesmatch] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {})
          }, 5000)
        }
      })
      .catch(() => {})
    }

    const role = interaction.options.getRole("role") || interaction.guild.roles.cache.get(role) || interaction.guild.roles.cache.find((rl) => rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase());

    let reason = `The current feature doesn't need a reason.`;
    if (!reason) reason = `No Reason Provided`;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    if (!role) {
      let rolenotfound = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${fail} | Please provide a valid role!`)
      .setTimestamp()
      .setFooter({ text: "https://mee8.ml" })
      .setColor(interaction.client.color.red)
      return interaction.reply({ embeds: [rolenotfound] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
      setTimeout(() => {
        interaction.deleteReply().catch(() => {});
      }, 5000)
        }
      })
      .catch(() => {});
    } else if (member.roles.cache.has(role.id)) {
      let userhasrole = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${fail} | The user already has that role!`)
      .setTimestamp()
      .setFooter({ text: "https://mee8.ml/" })
      .setColor(interaction.client.color.red)
      return interaction.reply({ embeds: [userhasrole] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000)
        }
      })
      .catch(() => {})
    } else {
      try {
        await member.roles.add(role, [
          `Role Add / Responsible User: ${interaction.user.tag}`,
        ]);
        const embed = new MessageEmbed()
        .setDescription(`${success} | Added **${role.name}** to **${member.user.tag}**`)
        .setColor(interaction.client.color.green)
        interaction.reply({ embeds: [embed] })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000)
          }
        })
        .catch(() => {})
      } catch (err) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`${fail} | Unable to remove the role to the user.`)
            .setTimestamp()
            .setFooter({ text: "https://mee8.ml/" })
            .setColor(interaction.guild.me.displayHexColor),
          ],
        });
      }
    }
  }
};