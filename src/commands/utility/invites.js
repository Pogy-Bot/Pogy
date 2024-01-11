const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "invites",
      aliases: [],
      description: "Checks the invites of the mentioned user",
      category: "Utility",
      cooldown: 3,
    });
  }

    async run(message, args) {
        const guildDB = await Guild.findOne({
            guildId: message.guild.id,
        });

        const language = require(`../../data/language/${guildDB.language}.json`);

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send(`${language.invalidUser} ${message.client.emoji.fail}`);
        }

        const invites = await message.guild.invites.fetch();

        const userInvites = invites.filter(invite => invite.inviter.id === member.id);

        const totalInvites = userInvites.reduce((acc, invite) => acc + invite.uses, 0);

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setAuthor(`Pogy.xyz`, this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${member.user.tag} has: **${totalInvites}** invites`)
            .setFooter(`Requested by: ${message.author.tag}`);

        await message.channel.sendCustom({ embeds: [embed] });
    }


};
