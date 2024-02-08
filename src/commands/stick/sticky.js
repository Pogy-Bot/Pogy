const fs = require('fs');
const path = require('path');
const Command = require("../../structures/Command");

module.exports = class SetupStickyCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "setupsticky",
            aliases: ["setsticky"],
            description: "Set up a sticky message in the current channel.",
            category: "Moderation",
            cooldown: 5,
            guildOnly: true,
            permissions: ["MANAGE_MESSAGES"],
        });
    }

    async run(message, args) {
        try {
            const guildId = message.guild.id;
            const stickyDataDir = path.join(__dirname, '..', '..', 'data', 'stickyData');
            const filePath = path.join(stickyDataDir, `${guildId}.json`);

            if (!fs.existsSync(stickyDataDir)) {
                fs.mkdirSync(stickyDataDir, { recursive: true });
            }

            let stickyData = {};

            if (fs.existsSync(filePath)) {
                stickyData = JSON.parse(fs.readFileSync(filePath));
            }

            const stickyContent = args.join(' ') || 'This is a sticky message!';
            const stickyChannelId = message.channel.id;

            // Delete the previous sticky message if exists
            const currentStickyMessageId = stickyData[stickyChannelId];
            if (currentStickyMessageId) {
                const previousStickyMessage = await message.channel.messages.fetch(currentStickyMessageId);
                if (previousStickyMessage) {
                    await previousStickyMessage.delete();
                }
            }

            // Send the new sticky message
            const newStickyMessage = await message.channel.send(stickyContent);
            stickyData[stickyChannelId] = newStickyMessage.id;
            stickyData[`${stickyChannelId}_content`] = stickyContent; // Store the content in the data
            saveStickyData(filePath, stickyData);

            message.channel.send("Sticky message has been set up!");
        } catch (error) {
            console.error("Error in the setupsticky command:", error);
            message.channel.send("An error occurred. Please try again later.");
        }
    }
};

function saveStickyData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
