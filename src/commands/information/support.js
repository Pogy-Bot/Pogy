const Command = require("../../structures/Command");
const emojis = require("../../assets/emojis.json");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class SupportCommand extends Command {
    constructor(...args) {
        super(...args, {
            name: "helpserver",
            aliases: ["supportserver", "ss"],
            description: "Empty command template.",
            category: "General",
            cooldown: 5,
        });
    }

    async run(message) {
        try {
            const embed = new MessageEmbed()
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription("https://discord.gg/FWJsSnVGgM Click to join !")
                .setThumbnail(message.guild.iconURL())
                .setColor(message.guild.me.displayHexColor);

            const serverButton = new MessageButton()
                .setLabel("Check out the support server!")
                .setURL("https://discord.gg/FWJsSnVGgM")
                .setStyle("LINK")
    

                const closeButton = new MessageButton()
                .setCustomId("close")
                .setLabel("Close")
                .setStyle("DANGER")
            

            const secretButton = new MessageButton()
            .setStyle("LINK")
            .setLabel("Secret Button")
            .setURL("https://2tv6h3-3000.csb.app/");
        

            const row = new MessageActionRow().addComponents(serverButton, closeButton, secretButton);

            const sentMessage = await message.channel.send({
                embeds: [embed],
                components: [row],
            });

            const collector = sentMessage.createMessageComponentCollector({
                filter: (i) => i.user.id === message.author.id,
                time: 15000,
            });

            collector.on("collect", async (i) => {
                await i.deferUpdate();
            
                if (i.customId === "server") {
                    // Handle "server" button click
                    await i.editReply({
                        content: "You clicked the server button!",
                        embeds: [embed],
                        components: [row],
                    });
                } else if (i.customId === "close") {
                    // Handle "close" button click
                    await sentMessage.delete()
            
                    // Delete the message
                    ;
                }
            
                // Clear components after processing the button click
                sentMessage.edit({ components: [] });
            });
            

        } catch (error) {
            console.error("Error in the empty command:", error);
            message.channel.send("An error occurred. Please try again later.");
        }
    }
};
