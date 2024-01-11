const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("anit-links")
  .setDescription("Sets anti-links if the message contains a link")
  .addStringOption((option) => option.setName("toggle").setDescription("Toggle between enable/disable").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const logging = await Logging.findOne({ guildId: interaction.guild.id });

    const toggle = interaction.options.getString("toggle");

    if(!toggle === "enable" || !toggle === "disable") {
      let embed = new MessageEmbed()
      .setColor(interaction.client.color.red)
      .setDescription(`${interaction.client.emoji.fail} | ${language.antiinvites1}`)
      return interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {})
    }

    if (toggle.toLowerCase() === "disable") {
      if (guildDB.antiLinks === false) {
        let embed = new MessageEmbed()
        .setColor(interaction.client.color.red)
        .setDescription(`${interaction.client.emoji.fail} | ${language.moduleDisabled}`)
        return interaction.reply({ embeds: [embed] })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000);
          }
        })
        .catch(() => {})
      };

      await Guild.findOne(
        {
          guildId: interaction.guild.id,
        },
        async (err, guild) => {
          guild.updateOne({
            antiLinks: false,
          })
          .catch((err) => console.error(err));

          let embed = new MessageEmbed()
          .setColor(interaction.client.color.green)
          .setDescription(`${interaction.client.emoji.success} | ${language.antilinks3}`)
          return interaction.reply({ embeds: [embed] })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {})
              }, 5000)
            }
          })
          .catch(() => {})
        }
      )
    }
  }
}