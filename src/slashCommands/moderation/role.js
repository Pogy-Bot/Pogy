const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("role")
  .setDescription("Adds a role to a user.")
  .addSubCommand((subcommand) => subcommand.setName("all").setDescription("Adds a role to all users.")
    .addRoleOption((option) => option.setName("role").setDescription("The role to add to the users.").setRequired(true))
    .addBooleanOption((option) => option.setName("remove").setDescription("Remove role or not")))
  .addSubCommand((subcommand) => subcommand.setName("bots").setDescription("Adds a role to all bots.")
    .addRoleOption((option) => option.setName("role").setDescription("The role to add to the bots.").setRequired(true))
    .addBooleanOption((option) => option.setName("remove").setDescription("Remove role or not")))
  .addSubCommand((subcommand) => subcommand.setName("humans").setDescription("Adds a role to all humans.")
    .addRoleOption((option) => option.setName("role").setDescription("The role to add to the humans.").setRequired(true))
    .addBooleanOption((option) => option.setName("remove").setDescription("Remove role or not")))
  .addSubCommand((subcommand) => subcommand.setName("add").setDescription("Adds a role to a user.")
    .addUserOption((option) => option.setName("user").setDescription("The user to add the role to.").setRequired(true))
    .addRoleOption((option) => option.setName("role").setDescription("The role to add."))),
  async execute(interaction) {
    if(!interaction.member.permissions.has("MANAGE_ROLES")) {
      return interaction.reply({ content: `You do not have permission to use this command.`, ephemeral: true });
    };
    const client = interaction.client;
    const fail = client.emoji.fail;
    const success = client.emoji.success;
    const logging = await Logging.findOne({ guildId: interaction.guild.id });
    
    if(interaction.options.getSubcommand() === "all") {
      const role = interaction.options.getRole("role") || interaction.guild.roles.cache.get(role) || interaction.guild.roles.cache.find((rl) => rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase());
      const removerole = interaction.options.getBoolean("remove") || false;
  
      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`
      };
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
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000)
          }
        })
        .catch(() => {});
      } else {
        if(removerole === false) {
          interaction.reply({ content: `${success} | Adding ${role} to ${fetchedMembers.size} members. This may take a while!` }).then(() => {
            interaction.guild.members.cache.forEach((member) => member.roles.add(role, [
              `Role Add / Responsible User: ${interaction.user.tag}`,
            ]));
            const embed = new MessageEmbed()
            .setDescription(`${success} | Added **${role}** to **${interaction.guild.members.cache.size.size}** members.`)
            .setColor(interaction.client.color.green)
            interaction.channel.send({ embeds: [embed] })
            .then(async () => {
              if (logging && logging.moderation.delete_reply === "true") {
                setTimeout(() => {
                  interaction.deleteReply().catch(() => {});
                }, 5000)
              }
            })
            .catch(() => {})
          });
        } else {
          interaction.reply({ content: `${success} | Removing ${role} from ${interaction.guild.members.cache.size} members. This may take a while!` }).then(() => {
            interaction.guild.members.cache.forEach((member) => member.roles.remove(role, [
              `Role Remove / Responsible User: ${interaction.user.tag}`,
            ]));
            const embed = new MessageEmbed()
            .setDescription(`${success} | Removed **${role}** from **${fetchedMembers.size}** members.`)
            .setColor(interaction.client.color.green)
            interaction.channel.send({ embeds: [embed] })
            .then(async () => {
              if (logging && logging.moderation.delete_reply === "true") {
                setTimeout(() => {
                  interaction.deleteReply().catch(() => {});
                }, 5000)
              }
            })
            .catch(() => {})
          });
        };
      }
    } else if (interaction.options.getSubcommand() === "bots") {
      const role = interaction.options.getRole("role") || interaction.guild.roles.cache.get(role) || interaction.guild.roles.cache.find((rl) => rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase());
      const removerole = interaction.options.getBoolean("remove") || false;

      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`
      }
      if(reason.length > 1024) {
        reason = reason.slice(0, 1021) + "...";
      }

      if(!role) {
        let rolenotfound = new MessageEmbed()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setDescription(`${fail} | Please provide a valid role!`)
        .setTimestamp()
        .setFooter({ text: "https://mee8.ml" })
        .setColor(interaction.client.color.red)
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000)
          }
        })
        .catch(() => {});
      } else {
        if(removerole === false) {
          interaction.reply({ content: `${success} | Adding ${role} to ${interaction.guild.members.cache.filter((m) => m.user.bot).size} bots. This may take a while!` }).then(() => {
            interaction.guild.members.cache.filter((m) => m.user.bot).forEach((member) => member.roles.add(role, [
              `Role Add / Responsible User: ${interaction.user.tag}`,
            ]));
            const embed = new MessageEmbed()
            .setDescription(`${success} | Added **${role}** to **${interaction.guild.members.cache.filter((m) => m.user.bot).size}** bots.`)
            .setColor(interaction.client.color.green)
            interaction.channel.send({ embeds: [embed] })
            .then(async () => {
              if (logging && logging.moderation.delete_reply === "true") {
                setTimeout(() => {
                  interaction.deleteReply().catch(() => {});
                }, 5000)
              }
            })
            .catch(() => {})
          });
        } else {
          interaction.reply({ content: `${success} | Removing ${role} from ${interaction.guild.members.cache.filter((m) => m.user.bot).size} bots. This may take a while!` }).then(() => {
            interaction.guild.members.cache.filter((m) => m.user.bot).forEach((member) => member.roles.remove(role, [
              `Role Remove / Responsible User: ${interaction.user.tag}`,
            ]));
            const embed = new MessageEmbed()
            .setDescription(`${success} | Removed **${role}** from **${interaction.guild.members.cache.filter((m) => m.user.bot).size}** bots.`)
            .setColor(interaction.client.color.green)
            interaction.channel.send({ embeds: [embed] })
            .then(async () => {
              if (logging && logging.moderation.delete_reply === "true") {
                setTimeout(() => {
                  interaction.deleteReply().catch(() => {});
                }, 5000)
              }
            })
            .catch(() => {})
          });
        }
      }
    } else if (interaction.options.getSubcommand() === "humans") {
      const role = interaction.options.getRole("role") || interaction.guild.roles.cache.get(role) || interaction.guild.roles.cache.find((rl) => rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase());
      const removerole = interaction.options.getBoolean("remove") || false;

      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`
      }
      if(reason.length > 1024) {
        reason = reason.slice(0, 1021) + "...";
      }

      if(!role) {
        let rolenotfound = new MessageEmbed()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setDescription(`${fail} | Please provide a valid role!`)
        .setTimestamp()
        .setFooter({ text: "https://mee8.ml" })
        .setColor(interaction.client.color.red)
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000)
          }
        })
        .catch(() => {});
      } else {
        if(removerole === false) {
          interaction.reply({ content: `${success} | Adding ${role.name} to ${interaction.guild.members.cache.filter((m) => !m.user.bot).size} humans. This may take a while!` }).then(() => {
            interaction.guild.members.cache.filter((m) => !m.user.bot).forEach((member) => member.roles.add(role, [
              `Role Add / Responsible User: ${interaction.user.tag}`,
            ]));
            const embed = new MessageEmbed()
            .setDescription(`${success} | Added **${role}** to **${interaction.guild.members.cache.filter((m) => !m.user.bot).size}** humans.`)
            .setColor(interaction.client.color.green)
            interaction.channel.send({ embeds: [embed] })
            .then(async () => {
              if (logging && logging.moderation.delete_reply === "true") {
                setTimeout(() => {
                  interaction.deleteReply().catch(() => {});
                }, 5000)
              }
            })
            .catch(() => {})
          });
        } else {
          interaction.reply({ content: `${success} | Removing ${role.name} from ${interaction.guild.members.cache.filter((m) => !m.user.bot).size} humans. This may take a while!` }).then(() => {
            interaction.guild.members.cache.filter((m) => !m.user.bot).forEach((member) => member.roles.remove(role, [
              `Role Remove / Responsible User: ${interaction.user.tag}`,
            ]))
            const embed = new MessageEmbed()
            .setDescription(`${success} | Removed **${role}** from **${interaction.guild.members.cache.filter((m) => !m.user.bot).size}** humans.`)
            .setColor(interaction.client.color.green)
            interaction.channel.send({ embeds: [embed] })
            .then(async () => {
              if (logging && logging.moderation.delete_reply === "true") {
                setTimeout(() => {
                  interaction.deleteReply().catch(() => {});
                }, 5000)
              }
            })
            .catch(() => {})
          });
        }
      }
    } else if (interaction.options.getSubcommand() === "add") {
      const member = interaction.options.getMember("user");
      const role = interaction.options.getRole("role") || interaction.guild.roles.cache.get(role) || interaction.guild.roles.cache.find((rl) => rl.name.toLowerCase() === role.slice(1).join(" ").toLowerCase());
      let reason = `The current feature doesn't need a reason.`;
      if (!reason) {
        reason = `No Reason Provided`
      }
      if(reason.length > 1024) {
        reason = reason.slice(0, 1021) + "...";
      }

      if(!role) {
        let rolenotfound = new MessageEmbed()
        .setAuthor({
          name: `${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .setDescription(`${fail} | Please provide a valid role!`)
        .setTimestamp()
        .setFooter({ text: "https://mee8.ml" })
        .setColor(interaction.client.color.red)
        return interaction.reply({ embeds: [rolenotfound], ephmeral: true })
        .then(async () => {
          if (logging && logging.moderation.delete_reply === "true") {
            setTimeout(() => {
              interaction.deleteReply().catch(() => {});
            }, 5000)
          }
        })
        .catch(() => {});
      } else {
        if(member.roles.cache.has(role.id)) {
          let alreadyhasrole = new MessageEmbed()
          .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
          })
          .setDescription(`${fail} | ${member} already has the role ${role}.`)
          .setTimestamp()
          .setFooter({ text: "https://mee8.ml" })
          .setColor(interaction.client.color.red)
          return interaction.reply({ embeds: [alreadyhasrole], ephmeral: true })
          .then(async () => {
            if (logging && logging.moderation.delete_reply === "true") {
              setTimeout(() => {
                interaction.deleteReply().catch(() => {});
              }, 5000)
            }
          })
        } else {
          member.roles.add(role, [
            `Role Add / Responsible User: ${interaction.user.tag}`,
          ]).then(() => {
            const embed = new MessageEmbed()
            .setDescription(`${success} | Added ${role} to ${member}.`)
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
          }).catch(() => {
            let botrolepossiblylow = new MessageEmbed()
            .setAuthor({
              name: `${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setDescription(`${fail} | The role is possibly higher than me or you. Please move my role above the role and try again!`)
            .setTimestamp()
            .setFooter({ text: "https://mee8.ml" })
            .setColor(interaction.client.color.red)
            return interaction.reply({ embeds: [botrolepossiblylow], ephmeral: true })
            .then(async () => {
              if (logging && logging.moderation.delete_reply === "true") {
                setTimeout(() => {
                  interaction.deleteReply().catch(() => {});
                }, 5000)
              }
            })
          })
        }
      }
    }
  }
};