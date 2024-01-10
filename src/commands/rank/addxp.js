// AddXPCommand.js
const Command = require("../../structures/Command");
const userData = require('/home/vboxuser/Pogy-1/src/data/users.json'); // Replace with your path
const fs = require('fs');

module.exports = class AddXPCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "addxp",
      description: "Adds experience points to a user.",
      category: "XP",
      cooldown: 3,
      userPermissions: ["ADMINISTRATOR"] // Require admin permissions
    });
  }

  async run(message, args) {
    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!targetUser || isNaN(amount) || amount <= 0) {
      return message.reply("Please mention a user and provide a valid XP amount.");
    }

    if (!userData[targetUser.id]) {
      userData[targetUser.id] = {
        xp: 0,
        level: 1
      };
    }

    userData[targetUser.id].xp += amount;

    // Save updated data back to the JSON file
    // (Assuming your code for saving data is similar to what you provided previously)
    // Replace this with your logic to save updated data to the JSON file
    fs.writeFile('/home/vboxuser/Pogy-1/src/data/users.json', JSON.stringify(userData, null, 2), (err) => {
     if (err) console.error('Error writing file:', err);
    });

    message.channel.send(`Added ${amount} XP to ${targetUser.tag}.`);
  }
};
