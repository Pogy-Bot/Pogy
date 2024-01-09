const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const autoResponse = require("../../database/schemas/autoResponse.js");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("autoresponse")
  .setDescription("Create a auto response which is triggered without prefix!")
  .addStringOption((option) => option.setName("command").setDescription("The name of the command").setRequired(true))
  .addStringOption((option) => option.setName("reply").setDescription("The reply when the command is triggered").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const prefix = guildDB.prefix;

    const language = require(`../../data/language/${guildDB.language}.json`);

      const logging = await Logging.findOne({ guildId: interaction.guild.id });

    const namee = interaction.options.getString("command");

    if (!namee) {
      let embed = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${language.properusage} \`${prefix}autoresponse <command-name> <text-reply>\`\n\n${language.example} \`${prefix}autoresponse ping pong\``)
      .setTimestamp()
      .setFooter({ text: "https://Pogy.ml/" })
      .setColor(interaction.guild.me.displayHexColor)
      return interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

    let name = namee.toLowerCase();
    const content = interaction.options.getString("reply");
    if (!content) {
      let embed = new MessageEmbed()
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(`${language.properusage} \`${prefix}autoresponse <command-name> <text-reply>\`\n\n${language.example} \`${prefix}autoresponse ping pong\``)
      .setTimestamp()
      .setFooter({ text: "https://Pogy.ml/" })
      .setColor(interaction.guild.me.displayHexColor)
      return interaction.reply({ embeds: [embed] })
      .then(async () => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            interaction.deleteReply().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    }

    if (namee.length > 60) return interaction.reply({ content: `${interaction.client.emoji.fail} | ${language.cc1}`, ephemeral: true });
    if (content.length > 2000) return interaction.reply({ content: `${interaction.client.emoji.fail} | ${language.cc2}`, ephemeral: true });

    if (guildDB.isPremium === "false") {
      const conditional = {
        guildId: interaction.guild.id,
      };
      const results = await autoResponse.find(conditional);

      if (results.length >= 10) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
            .setColor(interaction.guild.me.displayHexColor)
            .setDescription(`${interaction.client.emoji.fail} | Auto Response Limit Reached **(10)**\n\n[Upgrade to Premium here for unlimited commands](https://Pogy.ml/premium)`)
          ], ephemeral: true
        });

        return;
      }
    }

    autoResponse.findOne(
      {
        guildId: interaction.guild.id, name,
      },
      async (err, data) => {
        if (!data) {
          autoResponse.create({ guildId: interaction.guild.id, name, content });
          interaction.reply({
            embeds: [
              new MessageEmbed()
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
              })
              .setDescription(`**${language.cc3}** ${name}\n\nDelete the following auto response using \`${prefix}deleteresponse <command-name>\``)
              .setTimestamp()
              .setFooter({ text: "https://Pogy.ml" })
              .setColor(interaction.guild.me.displayHexColor),
            ], ephemeral: true
          });
        } else {
          return interaction.reply({ content: `${interaction.client.emoji.fail} | ${language.cc4}` });
        }
      }
    );
  }
};