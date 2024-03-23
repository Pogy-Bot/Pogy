const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const getCommitHistory = require("git-commits-npm");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "empty",
      aliases: [],
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      const axios = require("axios");
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      const getCommits = async () => {
        try {
          const response = await axios.get(
            "https://api.github.com/repos/hotsu0p/Pogy/commits",
          );
          const commits = response.data;
          const commitHistory = await getCommitHistory(
            "https://api.github.com/repos/hotsu0p/Pogy/commits",
          );
          console.log(`Total commits: ${commits.length}`);

          const embed = new MessageEmbed()
            .setTitle("Commits")
            .setDescription(`Commit message ${commits[0].commit.message}`)
            .addField("Commit Author", commits[0].commit.author.name)
            .setColor("#FF5733");

          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("test")
              .setLabel("testinng")
              .setStyle("SUCCESS"),
          );

          const sentMessage = await message.channel.sendCustom({
            embeds: [embed],
            components: [row],
          });

          const collector = sentMessage.createMessageComponentCollector({
            time: 15000,
          });

          collector.on("collect", async (i) => {
            sentMessage.edit(`${commitHistory}`);
          });

          collector.on("end", (collected) => {
            if (collected.size === 0) {
              sentMessage.edit({ components: [] });
            }
          });
        } catch (error) {
          console.error(`Error: ${error}`);
        }
      };

      getCommits();
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
