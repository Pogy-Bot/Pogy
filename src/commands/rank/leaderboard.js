const Command = require("../../structures/Command");
const Discord = require("discord.js");
const userData = require('/home/vboxuser/Pogy-1/src/data/users.json');

module.exports = class LeaderboardCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "leaderboard",
      description: "Display the server's leaderboard based on levels.",
      category: "Utility",
      cooldown: 5,
      guildOnly: true
    });
  }

  async run(message) {
    try {
      const users = Object.values(userData.users);
      const sortedUsers = users.sort((a, b) => b.level - a.level).slice(0, 10); // Sort users by level and take the top 10

      const leaderboardEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Server Leaderboard")
        .setDescription("Top 10 Users based on Levels:");

      for (let i = 0; i < sortedUsers.length; i++) {
        const user = sortedUsers[i];
        const member = message.guild.members.cache.get(user.id); // Get the member from the cache

        if (member) {
          leaderboardEmbed.addField(
            `#${i + 1} - ${member.user.tag}`,
            `Level: ${user.level}`
          );
        } else {
          leaderboardEmbed.addField(
            `#${i + 1} - Unknown`,
            `Level: ${user.level}`
          );
        }
      }

      message.channel.send({ embeds: [leaderboardEmbed] });
    } catch (error) {
      console.error("Error occurred:", error);
      message.reply('An error occurred while fetching the leaderboard.');
    }
  }
};
