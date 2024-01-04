const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("coinflip")
  .setDescription("Flip a coin"),
  async execute(interaction) {
    try {
      const client = interaction.client;
      const guildDB = await Guild.findOne({
        guildId: interaction.guild.id,
      });
  
      const language = require(`../../data/language/${guildDB.language}.json`);
  
      const n = Math.floor(Math.random() * 2);
      let result;
      if (n === 1) result = "heads";
      else result = "tails";
  
      const embed = new MessageEmbed()
      .setDescription(`\`${language.flippingCoin}\``)
      .setColor(interaction.guild.me.displayHexColor);
  
      const msg = await interaction.reply({ embeds: [embed] });
  
      const embe2 = new MessageEmbed()
      .setDescription(`${language.coiniflippedacoinfor} ${interaction.member}, ${language.coinitwas} **${result}**`)
      .setColor(client.color.blue);
      interaction.editReply({ embeds: [embe2] }).catch(() => {});
    } catch {
      interaction.reply({ content: `This command cannot be used in Direct Messages.`, ephemeral: true });
    }
  }
};