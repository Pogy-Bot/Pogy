const { CommandInteraction, MessageEmbed } = require("discord.js");
const Advancement = require("../../database/models/advancement.js");
const Command = require("../../structures/Command");

module.exports = class AdvancementsCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "advancements",
      aliases: ["achievements"],
      description: "Check your advancements",
      category: "General",
      cooldown: 5,
    });
  }

  async run(interaction) {
    try {
        const userID = interaction.user?.id;
const serverID = interaction.guild?.id;

if (!userID || !serverID) {
  // Log details for debugging
  console.error("User ID or Server ID is undefined");
  console.error("interaction.user:", interaction.user);
  console.error("interaction.guild:", interaction.guild);
  return;
}

// Log details for debugging
console.log("User ID:", userID);
console.log("Server ID:", serverID);
      // Fetch the user's advancements from the database
      const userAdvancements = await Advancement.findOne({
        userID,
        serverID,
      });

      if (!userAdvancements || userAdvancements.advancements.length === 0) {
        return interaction.reply("You haven't earned any advancements yet.");
      }

      // Create an embed to display the user's advancements
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`${interaction.user.username}'s Advancements`);

      userAdvancements.advancements.forEach((advancement) => {
        embed.addField(advancement, "Unlocked!");
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply("An error occurred while fetching advancements.");
    }
  }
};
