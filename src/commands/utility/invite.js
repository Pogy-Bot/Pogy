const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "invite",
      aliases: ["inv"],
      description: "Sends you Pogy's invite link",
      category: "Utility",
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle("Invite Pogy")
      .setURL("https://g5qzg2-5003.csb.app/invite")
      .setThumbnail(message.client.user.displayAvatarURL())
      .setDescription(language.invite)
      .setFooter(
        message.client.user.username,
        message.client.user.displayAvatarURL(),
      );
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Invite Pogy")
        .setStyle("LINK")
        .setURL("https://g5qzg2-5003.csb.app/invite"),

      new MessageButton()
        .setCustomId("support")
        .setLabel("More info")
        .setStyle("SECONDARY"), // can be "PRIMARY", "SECONDARY", "SUCCESS", "DANGER", "LINK", "INFO"
    );

    await message.channel.send({ embeds: [embed], components: [row] });
  }
};
