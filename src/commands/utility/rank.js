const Command = require("../../structures/Command");
const { createCanvas, loadImage } = require('canvas');
const Discord = require("discord.js");

// Calculate the required XP
function calculateRequiredXP(level) {
  const baseXP = 100;
  const increment = 150;
  return baseXP + (level - 1) * increment;
}

module.exports = class RankCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "rank",
      description: "Display your rank card.",
      category: "Images",
      cooldown: 5,
      guildOnly: true
    });
  }

  async run(message, args) {
    try {
      const userData = require('replace with real  users.json file'); // Load user data
      const targetUser = message.mentions.users.first() || message.author;
      const user = userData.users[targetUser.id];

      if (!user) {
        return message.reply('User not found.');
      }

      // create canvas
      const canvas = createCanvas(900, 250);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#041526';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Username
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = "left";
      ctx.fillText(targetUser.username, 260, 100);

      // Level
      ctx.font = 'bold 40px Arial';
      const levelText = `Level ${user.level}`;
      const levelTextWidth = ctx.measureText(levelText).width;
      ctx.fillText(levelText, canvas.width - levelTextWidth - 220, 50);

      //avatar
      const avatar = await loadImage(targetUser.displayAvatarURL({ format: 'png', size: 128 }));
      ctx.drawImage(avatar, 50, 50, 150, 150);

      // Progress bar
      const requiredXPForCurrentLevel = calculateRequiredXP(user.level);
      const requiredXPForNextLevel = calculateRequiredXP(user.level + 1);
      const progressBarWidth = 600;
      const progressWidth = ((user.xp - requiredXPForCurrentLevel) / (requiredXPForNextLevel - requiredXPForCurrentLevel)) * progressBarWidth;
      ctx.fillStyle = "#00FF00";
      ctx.fillRect(260, 220, progressWidth, 15);

      // Save the canvas
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank.png');

      // send the image
      message.channel.send({ files: [attachment] });
    } catch (error) {
      console.error("Error occurred:", error);
      message.reply('An error occurred while generating the rank card.');
    }
  }
};
