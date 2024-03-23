const Command = require("../../structures/Command");
const fs = require("fs");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const userData = require("../../data/users.json");
const userDataPath = "./src/data/users.json";

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "removexp",
      description: "Removes experience points from a user.",
      category: "Leveling",
      cooldown: 3,
      userPermissions: ["MANAGE_MESSAGES"], // Require admin permissions
    });
  }

  async run(message, args) {
    const targetUser = message.mentions.members.first();
    const amount = parseInt(args[1]);

    if (!targetUser || isNaN(amount) || amount <= 0) {
      return message.reply(
        "Please mention a user and provide a valid XP amount.",
      );
    }

    if (!userData.guilds[message.guild.id]?.users[targetUser.id]) {
      return message
        .reply("This user doesn't have a level profile!")
        .then((s) => {
          setTimeout(() => {
            s.delete();
          }, 5000);
        });
    }

    let previousLevelXP =
      (userData.guilds[message.guild.id].users[targetUser.id].level - 1) * 75;
    let xpNeededForPreviousLevel =
      (userData.guilds[message.guild.id].users[targetUser.id].level - 1) *
      previousLevelXP;

    userData.guilds[message.guild.id].users[targetUser.id].xp -= amount;
    const previousLevel =
      userData.guilds[message.guild.id].users[targetUser.id].level;
    while (
      xpNeededForPreviousLevel >
        userData.guilds[message.guild.id].users[targetUser.id].xp &&
      !(xpNeededForPreviousLevel === 0)
    ) {
      userData.guilds[message.guild.id].users[targetUser.id].level -= 1;
      previousLevelXP =
        (userData.guilds[message.guild.id].users[targetUser.id].level - 1) * 75;
      xpNeededForPreviousLevel =
        (userData.guilds[message.guild.id].users[targetUser.id].level - 1) *
        previousLevelXP;
    }
    const levelbed = new MessageEmbed()
      .setColor("#3498db")
      .setTitle("Level Lost!")
      .setAuthor(targetUser.user.username, targetUser.user.displayAvatarURL())
      .setDescription(
        `Unbelievable! You lost ${previousLevel - userData.guilds[message.guild.id].users[targetUser.id].level} ${previousLevel - userData.guilds[message.guild.id].users[targetUser.id].level == 1 ? "level!" : "levels!"}`,
      )
      .setFooter(
        `XP: ${
          userData.guilds[message.guild.id].users[targetUser.id].xp
        }/${xpNeededForPreviousLevel}`,
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("levelloss")
        .setLabel("Level Lost")
        .setStyle("DANGER"),
    );
    message.channel.sendCustom({
      embeds: [levelbed],
      components: [row],
    });

    fs.writeFileSync(userDataPath, JSON.stringify(userData));

    message.channel.send(
      `Removed ${amount} XP from ${targetUser.user.username}.`,
    );
  }
};
