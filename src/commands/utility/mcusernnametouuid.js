const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");

async function getPlayerData(username) {
  try {
    // Make a request to get the player's UUID
    const responseUUID = await axios.get(
      `https://api.mojang.com/users/profiles/minecraft/${username}`
    );

    // Check if the player was found
    if (!responseUUID.data) {
      console.log("Player not found");
      return null;
    }

    const uuid = responseUUID.data.id;
    const skinUrl = `https://mineskin.eu/armor/body/${username}/100.png`;
    const headUrl = `https://mineskin.eu/headhelm/${username}/100.png`;
    const bodyUrl = `https://mineskin.eu/armor/body/${username}/100.png`;
    const fullUrl = `https://mineskin.eu/armor/skin/${username}/100.png`;
    const chestUrl = `https://mineskin.eu/armor/bust/${username}/100.png`;
    const fullskinUrl = `https://mineskin.eu/skin/${username}`;

    return {
      uuid,
      fullskinUrl,
      chestUrl,
      skinUrl,
      headUrl,
      bodyUrl,
      fullUrl,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "getskin",
      description: "Get a Minecraft player's skin",
      category: "Information",
      cooldown: 3,
      aliases: ["getskin", "getskinurl", "getskinimage", "mcs"],
    });
  }

  async run(message) {
    const username = message.content.split(" ")[1];
    const view = message.content.split(" ")[2];

    if (!username) {
      return message.reply("Please provide a Minecraft username.");
    }

    const playerData = await getPlayerData(username);

    if (!playerData) {
      return message.reply("Player not found.");
    }

    let embedTitle = `${username}'s Skin`;
    let imageUrl = playerData.skinUrl;

    if (view === "head") {
      embedTitle = `${username}'s Head View`;
      imageUrl = playerData.headUrl;
      console.log(imageUrl);
    } else if (view === "body") {
      embedTitle = `${username}'s Body View`;
      imageUrl = playerData.bodyUrl;
      } else if (view === "Full") {
        embedTitle = `${username}'s Full Skin`;
        imageUrl = playerData.fullskinUrl;
    } else if (view === "chest") {
      embedTitle = `${username}'s Chest View`;
      imageUrl = playerData.chestUrl;
    }

    const embed = new MessageEmbed()
      .setTitle(embedTitle)
      .setImage(imageUrl)
      .setColor("#00FF00")
      .setFooter(`UUID: ${playerData.uuid}`);

    await message.reply({ embeds: [embed] });
  }
};
