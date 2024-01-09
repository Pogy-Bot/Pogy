const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("quote")
  .setDescription("Make a quoted text!")
  .addStringOption((option) => option.setName("text").setDescription("The text to quote").setRequired(true))
  .addChannelOption((option) => option.setName("channel").setDescription("This is optional")),
  async execute(interaction) {
    try {
      const guildDB = await Guild.findOne({
        guildId: interaction.guild.id,
      });
  
      const language = require(`../../data/language/${guildDB.language}.json`);
  
      if(!interaction.member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({ content: `${language.managemessages}` });
  
      let channel = interaction.options.getChannel("channel") || interaction.channel;
  
      if (channel.type != "GUILD_TEXT" || !channel.viewable) return interaction.reply({ content: `${language.notaccessible}` });
  
      const text = interaction.options.getString("text");
  
      if (!text) return interaction.reply({ content: `${language.whatdoIsay}` });
  
      if (!channel.permissionsFor(interaction.guild.me).has(["SEND_MESSAGES"])) return interaction.reply({ content: `${language.sendmessages}` });
  
      if (!channel.permissionsFor(interaction.member).has(["SEND_MESSAGES"]))return interaction.reply({ content: `${language.userSendMessages}` });
  
      interaction.reply({ content: `Your message has been quoted.`, ephemeral: true });
  
      channel.send(`>>> ${text}`, { disableMentions: "everyone" }).catch(() => {});
    } catch {
      interaction.reply({ content: "This command cannot be used in Direct Messages.", ephemeral: true });
    }
  }
};
