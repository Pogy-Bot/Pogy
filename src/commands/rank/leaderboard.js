const Command = require("../../structures/Command");
const Discord = require("discord.js");
const userData = require("../../data/users.json");
const guildData = require("../../data/users.json");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "leaderboard",
      description: "Display the server's leaderboard based on levels.",
      category: "Leveling",
      cooldown: 5,
      guildOnly: true,
    });
  }

  async run(message) {
    try {
      const guildId = message.guild.id;
      const users = Object.values(userData.guilds[guildId].users);
      const sortedUsers = users.sort((a, b) => b.level - a.level).slice(0, 10); // Sort users by level and take the top 10
      if (guildData[guildId] && guildData[guildId].levelingEnabled === false) {
        return message.reply("Leveling is disabled for this server.");
      }

      const leaderboardEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Server Leaderboard")
        .setDescription("Top 10 Users based on Levels:")
        .setFooter("Levels are calculated based on XP.");
      for (let i = 0; i < sortedUsers.length; i++) {
        const user = sortedUsers[i];
        let member;

        try {
          member = await message.guild.members.fetch(parseInt(users[i]).id); // Get the member from the cache
        } catch (error) {
          console.error("Error fetching member:", error);
        }

        leaderboardEmbed.addField(
          `#${i + 1} - ${member ? `${user.username}` : "Unknown"}`,
          `Level: ${user.level}`,
        );
      }

      message.channel.send({ embeds: [leaderboardEmbed] });
    } catch (error) {
      console.error("Error occurred:", error);
      message.reply("An error occurred while fetching the leaderboard.");
    }
  }
};
