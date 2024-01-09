const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("suggestions")
  .setDescription("Enable or disable suggestions")
  .addStringOption((option) => option.setName("option").setDescription("You can toggle suggestions and approve or decline them with this option.").setRequired(true))
    .addStringOption((option) => option.setName("message").setDescription("The message ID"))
    .addChannelOption((option) => option.setName("channel").setDescription("Optional channel."))
    .addStringOption((option) => option.setName("reason").setDescription("The reason..")),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const option = interaction.options.getString("option");

    let prefix = guildDB.prefix;
    let fail = interaction.client.emoji.fail;
    let properUsage = new MessageEmbed()
    .setColor(interaction.client.color.red)
    .setDescription(`${language.suggesting7.replace(/{prefix}/g, `${prefix}`)}`)
    .setFooter({ text: "https://Pogy.ml" });

    if (option.length < 1) {
      return interaction.reply({ embeds: [properUsage] });
    }

    if (option.includes("disable")) {
      if (guildDB.suggestion.suggestionChannelID === null)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | ${language.suggesting8}`)
          .setFooter({ text: "https://Pogy.ml" }),
        ], ephemeral: true
      });
      await Guild.findOne(
        {
          guildId: interaction.guild.id,
        },
        async (err, guild) => {
          guild.suggestion.suggestionChannelID = null;
          await guild.save().catch(() => {});

          return interaction.reply({
            embeds: [
              new MessageEmbed()
              .setColor(interaction.client.color.green)
              .setDescription(`${interaction.client.emoji.success} | ${language.suggesting9}`)
              .setFooter({ text: "https://Pogy.ml" }),
            ], ephemeral: true
          });
        }
      );
      return;
    } else if (option.includes("enable")) {
      const channel = interaction.options.getChannel("channel");

      if(!channel) return interaction.reply({ embeds: [properUsage], ephemeral: true });
      if (guildDB.suggestion.suggestionChannelID === channel.id)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${fail} | ${channel} ${language.suggesting10}`)
          .setFooter({ text: "https://Pogy.ml" }),
        ], ephemeral: true
      });
      await Guild.findOne(
        {
          guildId: interaction.guild.id,
        },
        async (err, guild) => {
          guild.suggestion.suggestionChannelID = channel.id;
          await guild.save().catch(() => {});

          return interaction.reply({
            embeds: [
              new MessageEmbed()
              .setColor(interaction.client.color.green)
              .setDescription(`${interaction.client.emoji.success} | ${language.suggesting11} ${channel}`),
            ], ephemeral: true
          });
        }
      );
    } else if (option.includes("approve") || option.includes("accept")) {
      if (guildDB.suggestion.decline == "false") {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} Staff can't approve or decline suggestions in this guild.`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });
      }
      if (!guildDB.suggestion.suggestionChannelID || !guildDB.suggestion.suggestionChannelID === null)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ format: "png" })
          })
          .setDescription(`${fail} | ${language.suggesting1}`)
          .setFooter({ text: "https://Pogy.ml" })
          .setTimestamp()
          .setColor("RED"),
        ], ephemeral: true
      });

      let suggestion = guildDB.suggestion.suggestionChannelID;
      let channel = interaction.guild.channels.cache.get(suggestion);
      if(!channel)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ format: "png" })
          })
          .setDescription(`${fail} | ${language.suggesting12}`)
          .setFooter({ text: "https://Pogy.ml" })
          .setTimestamp()
          .setColor("RED"),
        ],
      });

      let message = interaction.options.getString("message");
      if (!message)
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ format: "png" })
          })
          .setDescription(`${fail} | ${language.suggesting12}`)
          .setFooter({ text: "https://Pogy.ml" })
          .setTimestamp()
          .setColor("RED"),
        ], ephemeral: true
      });

      try {
        var suggestionMsg = await channel.messages.fetch(message);
      } catch (e) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | ${language.suggesting13}`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ], ephemeral: true
        });
        return;
      }

      let description = suggestionMsg.embeds[0].description;

      if (suggestionMsg.embeds[0].title !== `${language.suggesting3}`) {
        if (suggestionMsg.embeds[0].title === `${language.suggesting14}`) {
          interaction.reply({
            embeds: [
            new MessageEmbed()
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ format: "png" })
              })
              .setDescription(`${fail} | ${language.suggesting15}`)
              .setFooter({ text: "https://Pogy.ml" })
              .setTimestamp()
              .setColor("RED"),
            ], ephemeral: true
          });
        } else {
          interaction.reply({
            embeds: [
              new MessageEmbed()
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ format: "png" })
              })
              .setDescription(`${fail} | ${language.suggesting16}`)
              .setFooter({ text: "https://Pogy.ml" })
              .setTimestamp()
              .setColor("RED"),
            ], ephemeral: true
          });
        }

        return;
      }
      let reason = interaction.options.getString("reason") || `${language.noReasonProvided}`;
      var acceptReason = reason;
      if (!acceptReason) acceptReason = `${language.noReasonProvided}`;
      if (reason.length > 600)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | ${language.suggesting17}`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });

      const editedEmbed = new MessageEmbed()
      .setColor("#2bff80")
      .setTitle(`${language.suggesting14}`)
      .setDescription(`${description}\n\n**${language.suggesting18}**\n__**${language.reason}**__ ${acceptReason}\n__**${language.suggesting19}*__ ${interaction.user}`);

      suggestionMsg.edit({ embeds: [editedEmbed] });
      suggestionMsg.reactions.removeAll();
      interaction.reply({
        embeds: [
          new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ format: "png" })
          })
          .setDescription(`${interaction.client.emoji.success} | ${language.suggesting20} ${channel}\n\n__**${language.reason}**__ ${acceptReason}`)
          .setFooter({ text: "https://Pogy.ml" })
          .setTimestamp()
          .setColor("GREEN"),
        ],
      })
      .then(() => {
        setTimeout(() => {
          interaction.deleteReply().catch(() => {})
        }, 10000);
      });
    } else if (option.includes("decline") || option.includes("deny")) {
      if (guildDB.suggestion.decline == "false") {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | Staff con't approve or decline suggestions in this guild.`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });
      }
      if (!guildDB.suggestion.suggestionChannelID || !guildDB.suggestion.suggestChannelID === null)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | ${language.suggesting1}`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });

      let suggestion = guildDB.suggestion.suggestionChannelID;
      let channel = interaction.guild.channels.cache.get(suggestion);
      if (!channel)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | ${language.suggesting2}`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });

          let message = interaction.options.getString("message");
      if (!message)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | ${language.suggesting12}`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });

      try {
        suggestionMsg = await channel.messages.fetch(message);
      } catch (e) {
        interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | ${language.suggesting13}`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });
        return;
      }

      if (suggestionMsg.embeds[0].title !== `${language.suggesting3}`) {
         if (suggestionMsg.embeds[0].title === `${language.suggesting14}`) {
           interaction.reply({
            embeds: [
              new MessageEmbed()
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ format: "png" })
              })
              .setDescription(`${fail} | ${language.suggesting15}`)
              .setFooter({ text: "https://Pogy.ml" })
              .setTimestamp()
              .setColor("RED"),
            ],
          });
        } else {
          interaction.reply({
            embeds: [
              new MessageEmbed()
              .setAuthor({
                name: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ format: "png" })
              })
              .setDescription(`${fail} | ${language.suggesting16}`)
              .setFooter({ text: "https://Pogy.ml" })
              .setTimestamp()
              .setColor("RED"),
            ],
          });
        }

        return;
      }
      let reason = interaction.options.getString("reason") || `${language.noReasonProvided}`;
      acceptReason = reason;
      if (!acceptReason) acceptReason = `${language.noReasonProvided}`;

      if (reason.length > 600)
        return interaction.reply({
          embeds: [
            new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ format: "png" })
            })
            .setDescription(`${fail} | ${language.suggesting17}`)
            .setFooter({ text: "https://Pogy.ml" })
            .setTimestamp()
            .setColor("RED"),
          ],
        });

      suggestionMsg.reactions.removeAll();
      interaction.reply({
        embeds: [
          new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ format: "png" })
          })
          .setDescription(`${interaction.client.emoji.success} | ${language.suggesting24} ${channel}\n\n__**${language.reason}**__ ${acceptReason}`)
          .setFooter({ text: "https://Pogy.ml" })
          .setTimestamp()
          .setColor("GREEN"),
        ],
      })
      .then(() => {
        setTimeout(() => {
          interaction.deleteReply().catch(() => {});
        }, 10000);
      });
    } else if (option) {
      interaction.reply({ embeds: [properUsage] });
    } else {
      interaction.reply({ embeds: [properUsage] });
    }
  }
};