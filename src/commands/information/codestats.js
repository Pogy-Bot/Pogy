const Discord = require('discord.js');
const getCodeStats = require('@hotsuop/codestats');
const Command = require("../../structures/Command");

module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "codestats", 
      aliases: [], 
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      const folderPath = '/home/vboxuser/Pogy-3';

      // Define the configuration object
      const config = {
        languages: ['js', 'py', 'ejs', 'json'], // Add your desired languages
        exclude: ['node_modules', 'build'],
        depthLimit: Infinity,
      };

      // Call getCodeStats with the folder path and configuration
      const projectStats = await getCodeStats(folderPath, config);

      // Create a new message embed
      const embed = new Discord.MessageEmbed()
        .setTitle('Project Statistics')
        .addField('Total Files', String(projectStats.totalFiles), true)
        .addField('Total Lines', String(projectStats.totalLines), true)
        .addField('Total Characters', String(projectStats.totalCharacters), true)
        .addField('Total Functions', String(projectStats.totalFunctions), true)
        .addField('Total Classes', String(projectStats.totalClasses), true)
        .addField('Total Comments', String(projectStats.totalComments), true);

      // Send the embed to the channel
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
