const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "ileaderboard",
      aliases: ["ilb"],
      description: "Gives the invite leaderboard of the server",
      category: "Utility",
      cooldown: 3,
    });
  }

    async run(message, args) {
        const guildDB = await Guild.findOne({
            guildId: message.guild.id,
        });

        const language = require(`../../data/language/${guildDB.language}.json`);

        const invites = await message.guild.invites.fetch();

        const inviteCounts = {};

        invites.forEach(invite => {
            const { uses, inviter } = invite;
            const { username, discriminator } = inviter;

            const name = `${username}#${discriminator}`;

            inviteCounts[name] = (inviteCounts[name] || 0);
        });

        let leaderboard = "";

        Object.keys(inviteCounts)
            .sort((a, b) => inviteCounts[b] - inviteCounts[a])
            .forEach((name, index) => {
                leaderboard += `${index + 1}. ${name}: ${inviteCounts[name]}\n`;
            });

        // Fixed error    

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`${message.guild.name} Invite leaderboard`)
            .setFooter(message.client.user.username, message.client.user.displayAvatarURL())
            .setDescription(leaderboard);

        await message.channel.sendCustom({ embeds: [embed] });
    }



};
