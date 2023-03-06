const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("kill")
  .setDescription("Kill someone! (fake)")
  .addUserOption((option) => option.setName("member").setDescription("The member to (fake) kill").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    })

    const language = require(`../../data/language/${guildDB.language}.json`);
    const member = interaction.options.getMember("member");

    if (!member) return interaction.reply({ content: `${language.kill1}` }).catch(() => {
      interaction.reply({ content: `${language.kill1}` });
    });

    let user = member.user.username;

    const answers = [
      `${interaction.user.username} ${language.kill3} ${user}${language.kill4}`,
      `${user} ${language.kill5}`,
      `${user} ${language.kill6}`,
      `${user} ${language.kill7}`,
      `..Noo, ${interaction.user.username} ${language.kill8} ${user} ${language.kill9}`,
      `${user} ${language.kill10} ${interaction.user.username}${language.kill11}  `,
      `${user} ${language.kill12}`,
      `${user} ${language.kill13} ${interaction.user.username} ${language.kill14}`,
      `${user} ${language.kill15}`,
      `${interaction.user.username} ${language.kill16} ${user}${language.kill17}`,
      `${user} ${language.kill18}`,
      `${user} ${language.kill19}`,
      `${user} ${language.kill20}`,
      `${interaction.user.username} ${language.kill21} ${user} ${language.kill22}`,
      `${interaction.user.username} ${language.kill23} ${user}.. rip`,
      `${user} ${language.kill24}`,
      `${language.kill25} ${user}${language.kill26}`,
      `${language.kill27}  ${user}.. rip }`,
      `${interaction.user.username} crushes ${user} ${language.kill28}`,
      `${user} ${language.kill29}`,
      `${language.kill31} ${interaction.user.username}, ${user} ${language.kill30}`,
      `${user} ${language.kill32} `,
      `${user} ${language.kill33} `,
    ];

    if (member.id === interaction.member.id) return interaction.reply({ content: `${language.kill2}` }).catch(() => {
      interaction.reply({ content: `${language.kill1}` });
    });

    interaction.reply({ content: `${answers[Math.floor(Math.random() * answers.length)]}` }).catch(() => {
      interaction.reply({ content: `${language.kill1}` });
    });
  }
};