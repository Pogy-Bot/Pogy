const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const Vc = require("../../database/schemas/tempvc");
const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("tempvc")
  .setDescription(" Enable/disable tempvc")
  .addStringOption((option) => option.setName("toggle").setDescription("Enable or disable tempvc").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const vcDB = await Vc.findOne(
      {
        guildId: interaction.guild.id,
      },
      (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Vc({
            _id: mongoose.Types.ObjectId(),
            guildId: interaction.guild.id,
            channelId: null,
            categoryID: null,
          });

          newGuild.save().catch((err) => console.error(err));

          return;
        }
      }
    );

    const language = require(`../../data/language/${guildDB.language}.json`);

    const toggle = interaction.options.getString("toggle");

    let prefix = guildDB.prefix;
    let fail = interaction.client.emoji.fail;

    let properUsage = new MessageEmbed()
    .setColor(interaction.guild.me.displayHexColor)
    .setDescription(`${language.tempvc1.replace(/{prefix}/g, `${prefix}`)}`)
    .setFooter({ text: "https://Pogy.ml" });

    if (toggle.length < 1) {
      return interaction.reply({ embeds: [properUsage] });
    }

    if (toggle.includes("disable") || toggle.includes("off")) {
      if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
          })
          .setTitle(`${fail} | ${language.missingUser}`)
          .setDescription(`${language.tempvc2}`)
          .setTimestamp()
          .setFooter({ text: "https://Pogy.ml" }),
        ],
      })
      .setColor(interaction.guild.me.displayHexColor);

      if (!vcDB.channelId || !vcDB.categoryID || !vcDB.guildId || !vcDB.channelId === null) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | ${language.tempvc3}`)
          .setFooter({ text: "https://Pogy.ml" }),
        ],
      });
      await Vc.findOne(
        {
          guildId: interaction.guild.id,
        },
        async (err, guild) => {
          let voiceID = guild.channelId;
          let categoryID = guild.categoryID;

          let voice = interaction.client.channels.cache.get(voiceID);
          if (voice) voice.delete().catch(() => {});

          let category = interaction.client.channels.cache.get(categoryID);
          if (category) category.delete().catch(() => {});

          if (!guild) {
            Vc.create({
              guildId: interaction.guild.id,
              channelId: null,
              categoryID: null,
            });

            return;
          } else {
            guild.updateOne({
                      channelId: null,
              categoryID: null,
            })
            .catch((err) => console.error(err));
          }

          return interaction.reply({
            embeds: [
              new MessageEmbed()
              .setColor(interaction.client.color.green)
              .setDescription(`${interaction.client.emoji.success} | ${language.tempvc4}`)
              .setFooter({ text: "https://Pogy.ml" }),
            ], ephemeral: true
          });
        }
      );
      return;
    } else if (toggle.includes("enable") || toggle.includes("on")) {
      if (!interaction.member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
          })
          .setTitle(`${fail} ${language.missingUser}`)
          .setDescription(`${language.tempvc2}`)
          .setTimestamp()
          .setFooter({ text: "https://Pogy.ml" }),
        ], ephemeral: true
      })
      .setColor(interaction.guild.me.displayHexColor);

      try {
        const embed = new MessageEmbed()
        .setAuthor({
          name: `${language.tempvc5}`,
          iconURL: `https://www.creeda.co.in/Images/loader.gif`
        })
        .setDescription(`\`${language.tempvc6}\``)
        .setColor(interaction.guild.me.displayHexColor);
        const msg = await interaction.reply({ embeds: [embed] });

        let category = interaction.guild.channels.cache.find((c) => c.name.toLowerCase() == "join to create" && c.type == "GUILD_CATEGORY");
        setTimeout(async () => {
          if (!category) {
            await embed.setDescription(`**${language.tempvc7}**`)
            .setFooter({ text: `Chaoticv2.5` })
            .setTimestamp();
            interaction.editReply({ embeds: [embed] }) + interaction.guild.channels.create(`Join to Create`, {
              type: "GUILD_CATEGORY",
              permissionOverwrites: [
              {
                id: interaction.guild.id,
                allow: ["VIEW_CHANNEL"],
              },
                {
                  id: interaction.user.id,
                  allow: ["VIEW_CHANNEL"],
                },
              ],
            });
            return;
          } else {
            embed.setDescription(`**${language.tempvc8}**\n\nID: ${category.id}`)
            .setFooter({ text: `Chaoticv2.5` })
            .setTimestamp();
            interaction.editReply({ embeds: [embed] });
          }
        }, 2000);

        let voice = interaction.guild.channels.cache.find((c) => c.name.toLowerCase() == "join to create" && c.type == "GUILD_VOICE");

        setTimeout(async () => {
          if (!voice) {
            await embed.setDescription(`**${language.tempvc9}**`)
            .setFooter({ text: `Chaoticv2.5` })
            .setTimestamp();
            interaction.editReply({ embeds: [embed] }) + interaction.guild.channels.create("Join to create", {
              type: "GUILD_VOICE",
              permissionOverwrites: [
                {
                  id: interaction.guild.id,
                  allow: ["VIEW_CHANNEL"],
                },
                {
                  id: interaction.user.id,
                  allow: ["VIEW_CHANNEL"],
                },
              ],
            })
            .then(() => {
               if (!category) return;
              interaction.setParent(category.id).catch(() => {});
            });

            return;
          } else {
            embed.setDescription(`**${language.tempvc10}**\n\nID: ${voice.id}`)
            .setFooter({ text: `Chaoticv2.5` })
            .setTimestamp();
            interaction.editReply({ embeds: [embed] })
          }
        }, 2000);

        setTimeout(async () => {
          if (!voice || !category) {
            embed.setAuthor(`Setup Fail`)
            .setDescription(`${language.tempvc11.replace(/{prefix}/g, `${prefix}`)}`)
            .setFooter({ text: `Chaoticv2.5` })
            .setTimestamp();
            interaction.editReply({ embeds: [embed] });
            await Vc.findOne(
              {
                guildId: interaction.guild.id,
              },
              async (err, guild) => {
                if (!guild) {
                  Vc.create({
                    guildId: interaction.guild.id,
                    channelId: null,
                    categoryID: null,
                  });

                  return;
                } else {
                  guild.updateOne({
                    channelId: null,
                    categoryID: null,
                  })
                  .catch((err) => console.error(err));
                }
              }
            );

            return;
          } else {
            let channelVoice = interaction.client.channels.cache.get(voice.id);
            let channelInv = await channelVoice.createInvite({
              maxAge: 0,
              maxUses: 0,
            })
            .catch(() => {});
            voice.setParent(category.id);
            embed.setAuthor(`${language.tempvc12}`, `https://Pogy.ml/logo.png`, `${channelInv}`)
            .setDescription(`**${language.tempvc13}** ${category.name}\n**${language.tempvc13} ID:** ${category.id}\n\n**${language.tempvc14}** ${voice.name}\n**${language.tempvc14} ID:** ${voice.id}\n\n${language.tempvc15} \`${prefix}tempvc off\``)
            .setFooter({ text: `Chaoticv2.5` })
            .setTimestamp();
            interaction.editReply({ embeds: [embed] });
            if (channelInv && channelVoice)
              interaction.followUp({ content: `${channelInv}` });
            await Vc.findOne(
              {
                guildId: interaction.guild.id,
              },
              async (err, guild) => {
                if (!guild) {
                  Vc.create({
                    guildId: interaction.guild.id,
                    channelId: voice.id,
                    categoryID: category.id,
                  });

                  return;
                } else {
                  guild.updateOne({
                    channelId: voice.id,
                    categoryID: category.id,
                  })
                  .catch((err) => console.error(err));
                }
              }
            );
          }
        }, 2000);
      } catch {
        interaction.reply({
          embeds: [
            new MessageEmbed()
            .setDescription(`${language.tempvc16}`)
            .setColor(`RED`),
          ],
        });
        await Vc.findOne(
          {
            guildId: interaction.guild.id,
          },
          async (err, guild) => {
            if (!guild) {
              Vc.create({
                guildId: interaction.guild.id,
                channelId: null,
                categoryID: null,
              });

              return;
            } else {
              guild.updateOne({
                channelId: null,
                categoryID: null,
              })
              .catch((err) => console.error(err));
            }
          }
        );
      }
    } else if (toggle[0]) {
      interaction.reply({ embeds: [properUsage] })
    } else {
      interaction.reply({ embeds: [properUsage] })
    }
  }
};