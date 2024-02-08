const Command = require("../../structures/Command");
const married = require("../../database/models/family/married.js");
const { createCanvas, loadImage } = require('canvas');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "checkmaried",
      aliases: [],
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      // grab data from the db
      const marriedData = await married.findOne({
        serverId: message.guild.id,
        userID: message.author.id,
      });

      // format the data for the canvas image
      const marriedData2 = {
        mariedId: marriedData.mariedId,
        userID: marriedData.userID,
        serverId: marriedData.serverId,
        username: marriedData.username,
        mariedAvatar: marriedData.mariedAvatar,
        userAvatar: marriedData.userAvatar,
      };

      // Load avatars asynchronously

      const canvas = createCanvas(400, 150);
      const ctx = canvas.getContext('2d');

      ctx.font = "20px Arial";
      ctx.fillStyle = "red";
      ctx.strokeStyle = "black";
      ctx.fillText(`You are married to ${JSON.stringify(marriedData2.username)}`, 50, 50);

      // Convert canvas to image data
      const imageData = canvas.toDataURL("image/png");

      // Extract the base64 data from the URL
      const data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(data, 'base64');

      // Send the image as a file
      await message.channel.send({ files: [{ attachment: buffer, name: 'image.png' }] });
    } catch (error) {
      console.error("Error in the checkmaried command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
