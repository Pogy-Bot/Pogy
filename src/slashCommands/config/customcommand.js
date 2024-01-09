const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const customCommand = require("../../database/schemas/customCommand.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("createcommand")
  .setDescription("Create a custom command")
  .addStringOption((option) => option.setName("command").setDescription("The command name").setRequired(true))
  .addStringOption((option) => option.setName("reply").setDescription("The reply").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id
    });

    let prefix = guildDB.prefix;

    const language = require(`../../data/language/${guildDB.language}.json`);
    const namee = interaction.options.getString("command");

    if (!namee) return interaction.reply({
      embeds: [
        new MessageEmbed()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setDescription(`${language.properusage} \`${prefix}customcommand <command-name> <text-reply>\`\n\n${language.example} \`${prefix}customcommand ping pong\``)
        .setTimestamp()
        .setFooter({ text: "https://mee8.ml/" })
        .setColor(interaction.guild.me.displayHexColor),
      ],
    });

    let name = namee.toLowerCase();
    const content = interaction.options.getString("reply");
    if (!content) return interaction.reply({
      embeds: [
        new MessageEmbed()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setDescription(`${language.properusage} \`${prefix}customcommand <command-name> <text-reply>\`\n\n${language.example} \`${prefix}customcommand ping pong\``)
        .setTimestamp()
        .setFooter({ text: "https://mee8.ml" })
        .setColor(interaction.guild.me.displayHexColor),
      ],
    });

    if (namee.length > 30) return interaction.reply({ content: `${interaction.client.emoji.fail} | ${language.cc1}` });

    if (content.length > 2000) return interaction.reply({ content: `${interaction.client.emoji.fail} | ${language.cc2}` });

    if (interaction.client.botCommands.get(namee) || interaction.client.aliases.get(namee)) return interaction.reply({ content: `That command is already an existing bot command!` });

    if (guildDB.isPremium === "false") {
      const conditional = {
          guildId: interaction.guild.id
      };
      const results = await customCommand.find(conditional);

      if (results.length >= 10) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
            .setColor(interaction.guild.me.displayHexColor)
            .setDescription(`${interaction.client.emoji.fail} | Custom Command Limit Reached **(10)**\n\n[Upgrade to Premium Here for unlimited commands](https://mee8.ml/premium)`),
          ],
        });

        return;
      }
    }

    customCommand.findOne(
      {
        guildId: interaction.guild.id, name
      },
      async (err, data) => {
        if (!data) {
          customCommand.create({ guildId: interaction.guild.id, name, content });
          interaction.reply({
            embeds: [
        new MessageEmbed()
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
              })
              .setDescription(`**${language.cc3}** ${name}\n\nDelete the following command using \`${prefix}deletecommand <command-name>\``)
              .setTimestamp()
              .setFooter({ text: "https://mee8.ml" })
              .setColor(interaction.guild.me.displayHexColor),
            ],
          });
        } else {
          return interaction.reply({ content: `${interaction.client.emoji.fail} | ${language.cc4}` });
        }
      }
    );
  }
};