// AddXPCommand.js
const Command = require("../../structures/Command");
const fs = require("fs");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const userData = require("../../data/users.json");
const userDataPath = "./src/data/users.json";

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "addxp",
      description: "Adds experience points to a user.",
      category: "Leveling",
      cooldown: 3,
      userPermissions: ["MANAGE_MESSAGES"], // Require admin permissions
    });
  }

  async run(message, args) {
    const targetUser = message.mentions.users.first();
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

    let nextLevelXP =
      userData.guilds[message.guild.id].users[targetUser.id].level * 75;
    let xpNeededForNextLevel =
      userData.guilds[message.guild.id].users[targetUser.id].level *
      nextLevelXP;

    userData.guilds[message.guild.id].users[targetUser.id].xp += amount;
    const previouslevel =
      userData.guilds[message.guild.id].users[targetUser.id].level;
    while (
      userData.guilds[message.guild.id].users[targetUser.id].xp >=
      xpNeededForNextLevel
    ) {
      userData.guilds[message.guild.id].users[targetUser.id].level += 1;
      nextLevelXP =
        userData.guilds[message.guild.id].users[targetUser.id].level * 75;
      xpNeededForNextLevel =
        userData.guilds[message.guild.id].users[targetUser.id].level *
        nextLevelXP;
    }
    const levelbed = new MessageEmbed()
      .setColor("#3498db")
      .setTitle("Level Up!")
      .setAuthor(targetUser.user.username, targetUser.user.displayAvatarURL())
      .setDescription(
        `You have reached level ${userData.guilds[message.guild.id].users[targetUser.id].level}! An increase of ${userData.guilds[message.guild.id].users[targetUser.id].level - previouslevel} ${userData.guilds[message.guild.id].users[targetUser.id].level - previouslevel == 1 ? "level!" : "levels!"}`,
      )
      .setFooter(
        `XP: ${userData.guilds[message.guild.id].users[targetUser.id].xp}/${xpNeededForNextLevel}`,
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("levelup")
        .setLabel("Level Up")
        .setStyle("SUCCESS"),
    );
    message.channel.sendCustom({
      embeds: [levelbed],
      components: [row],
    });

    fs.writeFileSync(userDataPath, JSON.stringify(userData));

    message.channel.send(`Added ${amount} XP to ${targetUser.user.username}.`);
  }
};
