const Command = require("../../structures/Command");
const Discord = require("discord.js");
const userData = require("../../data/users.json");

module.exports = class LeaderboardCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "leaderboard",
      description: "Display the server's leaderboard based on levels.",
      category: "Utility",
      cooldown: 5,
      guildOnly: true,
    });
  }

  async run(message) {
    try {
      const guild = message.guild;
      const users = Object.values(userData.guilds[guild.id].users);
      const sortedUsers = users.sort((a, b) => b.level - a.level).slice(0, 10); // Sort users by level and take the top 10

      const leaderboardEmbed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Server Leaderboard")
        .setDescription("Top 10 Users based on Levels:");

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
          `Level: ${user.level}`
        );
      }

      message.channel.send({ embeds: [leaderboardEmbed] });
    } catch (error) {
      console.error("Error occurred:", error);
      message.reply("An error occurred while fetching the leaderboard.");
    }
  }
};
