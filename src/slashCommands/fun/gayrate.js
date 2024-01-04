const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("gayrate")
  .setDescription("See how gay you are")
  .addUserOption((option) => option.setName("member").setDescription("Optional")),
  async execute(interaction) {
      try {
      const guildDB = await Guild.findOne({
        guildId: interaction.guild.id,
      });
  
      const language = require(`../../data/language/${guildDB.language}.json`);
  
      function randomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      const target = interaction.options.getMember("member");
  
      let amount = randomInteger(1, 100);
  
      let embedd = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`${language.simpmachinee}`)
      .setDescription(`${language.simpyouare} **${amount}%** gay`);
  
      let targett = target.username;
      let embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`${language.simpmachinee}`)
      .setDescription(`${targett} ${langauge.simpIs} **${amount}%** gay`);
      interaction.reply({ embeds: [embed]})
    } catch {
        interaction.reply({ content: `This command cannot be used in Direct Messages.`, ephemeral: true });
    }
  }
}