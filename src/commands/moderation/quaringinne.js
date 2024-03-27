const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
module.exports = class RemoveRolesCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "Quarantine",
      aliases: ["clearroles", "clearrole"],
      category: "Moderation",
      description:
        "Remove all roles from a user and assign the Quarantine role.",
      cooldown: 5,
      botPermission: ["MANAGE_ROLES"],
      usage: "<user>",
    });
  }

  async run(message, args) {
    try {
      const missingRolesMessage =
        "You don't have the Administrator permission.";
      const successMessage = `Removed all roles from  and assigned the Quarantine role.`;
      const errorMessage = "An error occurred. Please try again later.";

      const missingRolesMessageemebd = new MessageEmbed()
        .setColor("#fe0a0a")
        .setDescription(missingRolesMessage)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
      const errorMessageemebd = new MessageEmbed()
        .setColor("#3498db")
        .setDescription(errorMessage)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
      const targetUser = message.mentions.members.first();

      const { PermissionsBitField } = require("discord.js");

      // Assuming `member` is a GuildMember object
      if (message.member.permissions.has("ADMINISTRATOR")) {
      } else {
        return message.channel.send({ embeds: [missingRolesMessageemebd] });
      }
      if (!targetUser) {
        return message.channel.send("Please mention a user to remove roles.");
      }

      const quarantineRole =
        message.guild.roles.cache.find((role) => role.name === "Quarantine") ||
        (await message.guild.roles.create({
          name: "Quarantine",
          color: "#fe0a0a",
          reason: "Quarantine role",
          permissions: "0",
        }));

      await targetUser.roles.set([]);

      await targetUser.roles.add(quarantineRole);
      const workingbed = new MessageEmbed()
        .setColor("#3498db")
        .setDescription(
          `Quarantined ${targetUser.user.tag}`
        )
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
      message.channel.send({ embeds: [workingbed] });
    } catch (error) {
      console.error("Error in the removeroles command:", error);
      message.channel.send({ embeds: [errorMessageembed] });
    }
  }
};
