const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Adds a role to a user.")
    .addSubCommand((subcommand) =>
      subcommand
        .setName("all")
        .setDescription("Adds a role to all users.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add to the users.")
            .setRequired(true),
        )
        .addBooleanOption((option) =>
          option.setName("remove").setDescription("Remove role or not"),
        ),
    )
    .addSubCommand((subcommand) =>
      subcommand
        .setName("bots")
        .setDescription("Adds a role to all bots.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add to the bots.")
            .setRequired(true),
        )
        .addBooleanOption((option) =>
          option.setName("remove").setDescription("Remove role or not"),
        ),
    )
    .addSubCommand((subcommand) =>
      subcommand
        .setName("humans")
        .setDescription("Adds a role to all humans.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add to the humans.")
            .setRequired(true),
        )
        .addBooleanOption((option) =>
          option.setName("remove").setDescription("Remove role or not"),
        ),
    )
    .addSubCommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds a role to a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add the role to.")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add.")
            .setRequired(true),
        ),
    )
    .addSubCommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes a role from a user.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove the role from.")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove.")
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("MANAGE_ROLES")) {
      return interaction.reply({
        content: `You do not have permission to use this command.`,
        ephemeral: true,
      });
    }
    const client = interaction.client;
    const fail = client.emoji.fail;
    const success = client.emoji.success;
    const logging = await Logging.findOne({ guildId: interaction.guild.id });

    if (interaction.options.getSubcommand() === "all") {
      const role =
        interaction.options.getRole("role") ||
        interaction.guild.roles.cache.get(role) ||
        interaction.guild.roles.cache.find(
          (rl) =>
            rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase(),
        );
      const removerole = interaction.options.getBoolean("remove") || false;

      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`;
      }
      if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

      if (!role) {
        let rolenotfound = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`${fail} | Please provide a valid role!`)
          .setTimestamp()
          .setFooter({
            text: `${process.env.AUTH_DOMAIN}`,
          })
          .setColor(interaction.client.color.red);
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true });
      } else {
        if (removerole === false) {
          interaction
            .reply({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    `${success} | Adding ${role} to ${interaction.guild.members.cache.size} members. This may take a while!`,
                  )
                  .setColor(interaction.client.color.green),
              ],
            })
            .then(() => {
              interaction.guild.members.cache.forEach((member) =>
                member.roles.add(role, [
                  `Role Add / Responsible User: ${interaction.user.tag}`,
                ]),
              );
            })
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(
                  `${success} | Added **${role}** to **${interaction.guild.members.cache.size.size}** members.`,
                )
                .setColor(interaction.client.color.green);
              interaction
                .editReply({ embeds: [embed] })
                .then(async () => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            });
        } else {
          interaction
            .reply({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    `${success} | Removing ${role} from ${interaction.guild.members.cache.size} members. This may take a while!`,
                  )
                  .setColor(interaction.client.color.green),
              ],
            })
            .then(() => {
              interaction.guild.members.cache.forEach((member) =>
                member.roles.remove(role, [
                  `Role Remove / Responsible User: ${interaction.user.tag}`,
                ]),
              );
            })
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(
                  `${success} | Removed **${role}** from **${interaction.guild.members.cache.size}** members.`,
                )
                .setColor(interaction.client.color.green);
              interaction
                .editReply({ embeds: [embed] })
                .then(async () => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            });
        }
      }
    } else if (interaction.options.getSubcommand() === "bots") {
      const role =
        interaction.options.getRole("role") ||
        interaction.guild.roles.cache.get(role) ||
        interaction.guild.roles.cache.find(
          (rl) =>
            rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase(),
        );
      const removerole = interaction.options.getBoolean("remove") || false;

      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`;
      }
      if (reason.length > 1024) {
        reason = reason.slice(0, 1021) + "...";
      }

      if (!role) {
        let rolenotfound = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`${fail} | Please provide a valid role!`)
          .setTimestamp()
          .setFooter({
            text: `${process.env.AUTH_DOMAIN}`,
          })
          .setColor(interaction.client.color.red);
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true });
      } else {
        if (removerole === false) {
          interaction
            .reply({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    `${success} | Adding ${role} to ${
                      interaction.guild.members.cache.filter((m) => m.user.bot)
                        .size
                    } bots. This may take a while!`,
                  )
                  .setColor(interaction.client.color.green),
              ],
            })
            .then(() => {
              interaction.guild.members.cache
                .filter((m) => m.user.bot)
                .forEach((member) =>
                  member.roles.add(role, [
                    `Role Add / Responsible User: ${interaction.user.tag}`,
                  ]),
                );
            })
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(
                  `${success} | Added **${role}** to **${
                    interaction.guild.members.cache.filter((m) => m.user.bot)
                      .size
                  }** bots.`,
                )
                .setColor(interaction.client.color.green);
              interaction
                .editReply({ embeds: [embed] })
                .then(async () => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            });
        } else {
          interaction
            .reply({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    `${success} | Removing ${role} from ${
                      interaction.guild.members.cache.filter((m) => m.user.bot)
                        .size
                    } bots. This may take a while!`,
                  )
                  .setColor(interaction.client.color.green),
              ],
            })
            .then(() => {
              interaction.guild.members.cache
                .filter((m) => m.user.bot)
                .forEach((member) =>
                  member.roles.remove(role, [
                    `Role Remove / Responsible User: ${interaction.user.tag}`,
                  ]),
                );
            })
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(
                  `${success} | Removed **${role}** from **${
                    interaction.guild.members.cache.filter((m) => m.user.bot)
                      .size
                  }** bots.`,
                )
                .setColor(interaction.client.color.green);
              interaction
                .editReply({ embeds: [embed] })
                .then(async () => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            });
        }
      }
    } else if (interaction.options.getSubcommand() === "humans") {
      const role =
        interaction.options.getRole("role") ||
        interaction.guild.roles.cache.get(role) ||
        interaction.guild.roles.cache.find(
          (rl) =>
            rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase(),
        );
      const removerole = interaction.options.getBoolean("remove") || false;

      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`;
      }
      if (reason.length > 1024) {
        reason = reason.slice(0, 1021) + "...";
      }

      if (!role) {
        let rolenotfound = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`${fail} | Please provide a valid role!`)
          .setTimestamp()
          .setFooter({
            text: `${process.env.AUTH_DOMAIN}`,
          })
          .setColor(interaction.client.color.red);
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true });
      } else {
        if (removerole === false) {
          interaction
            .reply({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    `${success} | Adding ${role.name} to ${
                      interaction.guild.members.cache.filter((m) => !m.user.bot)
                        .size
                    } humans. This may take a while!`,
                  )
                  .setColor(interaction.client.color.green),
              ],
            })
            .then(() => {
              interaction.guild.members.cache
                .filter((m) => !m.user.bot)
                .forEach((member) =>
                  member.roles.add(role, [
                    `Role Add / Responsible User: ${interaction.user.tag}`,
                  ]),
                );
            })
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(
                  `${success} | Added **${role}** to **${
                    interaction.guild.members.cache.filter((m) => !m.user.bot)
                      .size
                  }** humans.`,
                )
                .setColor(interaction.client.color.green);
              interaction
                .editReply({ embeds: [embed] })
                .then(async () => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            });
        } else {
          interaction
            .reply({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    `${success} | Removing ${role.name} from ${
                      interaction.guild.members.cache.filter((m) => !m.user.bot)
                        .size
                    } humans. This may take a while!`,
                  )
                  .setColor(interaction.client.color.green),
              ],
            })
            .then(() => {
              interaction.guild.members.cache
                .filter((m) => !m.user.bot)
                .forEach((member) =>
                  member.roles.remove(role, [
                    `Role Remove / Responsible User: ${interaction.user.tag}`,
                  ]),
                );
            })
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(
                  `${success} | Removed **${role}** from **${
                    interaction.guild.members.cache.filter((m) => !m.user.bot)
                      .size
                  }** humans.`,
                )
                .setColor(interaction.client.color.green);
              interaction
                .editReply({ embeds: [embed] })
                .then(async () => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            });
        }
      }
    } else if (interaction.options.getSubcommand() === "add") {
      const member = interaction.options.getMember("user");
      const role =
        interaction.options.getRole("role") ||
        interaction.guild.roles.cache.get(role) ||
        interaction.guild.roles.cache.find(
          (rl) =>
            rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase(),
        );
      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`;
      }
      if (reason.length > 1024) {
        reason = reason.slice(0, 1021) + "...";
      }

      if (!role) {
        let rolenotfound = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`${fail} | Please provide a valid role!`)
          .setTimestamp()
          .setFooter({
            text: `${process.env.AUTH_DOMAIN}`,
          })
          .setColor(interaction.client.color.red);
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true });
      } else {
        if (member.roles.cache.has(role.id)) {
          let alreadyhasrole = new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(`${fail} | ${member} already has the role ${role}.`)
            .setTimestamp()
            .setFooter({
              text: `${process.env.AUTH_DOMAIN}`,
            })
            .setColor(interaction.client.color.red);
          return interaction.reply({
            embeds: [alreadyhasrole],
            ephmeral: true,
          });
        } else {
          member.roles
            .add(role, [`Role Add / Responsible User: ${interaction.user.tag}`])
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(`${success} | Added ${role} to ${member}.`)
                .setColor(interaction.client.color.green);
              interaction
                .reply({ embeds: [embed] })
                .then(async () => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            })
            .catch(() => {
              let botrolepossiblylow = new MessageEmbed()
                .setAuthor({
                  name: `${interaction.user.tag}`,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                  `${fail} | The role is possibly higher than me or you. Please move my role above the role and try again!`,
                )
                .setTimestamp()
                .setFooter({
                  text: `${process.env.AUTH_DOMAIN}`,
                })
                .setColor(interaction.client.color.red);
              return interaction.reply({
                embeds: [botrolepossiblylow],
                ephmeral: true,
              });
            });
        }
      }
    } else if (interaction.options.getSubcommand() === "remove") {
      let member = interaction.options.getMember("user");
      let role =
        interaction.options.getRole("role") ||
        interaction.guild.roles.cache.get(role) ||
        interaction.guild.roles.cache.find(
          (rl) =>
            rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase(),
        );
      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No reason provided.`;
      }
      if (reason.length > 1024) {
        reason = reason.slice(0, 1021) + "...";
      }

      if (!role) {
        const rolenotfound = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(`${fail} | Please provide a valid role!`)
          .setTimestamp()
          .setFooter({
            text: `${process.env.AUTH_DOMAIN}`,
          })
          .setColor(interaction.client.color.red);
        return interaction.reply({ embeds: [rolenotfound], ephemeral: true });
      } else {
        if (!member.roles.cache.has(role.id)) {
          const nothasrole = new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setDescription(
              `${fail} | ${member} doesn't have the role ${role}!`,
            )
            .setTimestamp()
            .setFooter({
              text: `${process.env.AUTH_DOMAIN}`,
            })
            .setColor(interaction.client.color.red);
          return interaction.reply({ embeds: [nothasrole], ephemeral: true });
        } else {
          member.roles
            .remove(role, [
              `Role Remove / Responsible User: ${interaction.user.tag}`,
            ])
            .then(() => {
              const embed = new MessageEmbed()
                .setDescription(`${success} | Removed ${role} from ${member}.`)
                .setColor(interaction.client.color.green);
              interaction
                .reply({ embeds: [embed] })
                .then(() => {
                  if (logging && logging.moderation.delete_reply === "true") {
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {});
                    }, 5000);
                  }
                })
                .catch(() => {});
            })
            .catch(() => {
              let botrolepossiblylow = new MessageEmbed()
                .setAuthor({
                  name: `${interaction.user.tag}`,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                  `${fail} | The role is possibly higher than me or you. Please move my role above the role and try again.`,
                )
                .setTimestamp()
                .setFooter({
                  text: `https://6c7f021b-2514-4460-9d5a-64060cec1990-00-30w9y136gg7mt.riker.replit.dev`,
                })
                .setColor(interaction.client.color.red);
              return interaction.reply({
                embeds: [botrolepossiblylow],
                ephemeral: true,
              });
            });
        }
      }
    }
  },
};
