const { SlashCommandBuilder } = require("@discordjs/builders");
const Guild = require("../../database/schemas/Guild");
const darkrandom = require("random");
const darkemail = require("random-email");
const darkpassword = require("generate-password");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("hack")
  .setDescription("Hack someone! (fake)")
  .addUserOption((option) => option.setName("user").setDescription("The user to hack").setRequired(true)),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const impostorpassword = darkpassword.generate({
      length: 10,
      numbers: true,
    });

    const user = interaction.options.getMember("user");

    if (!user) {
      return interaction.reply({ content: `${language.hack1}`, ephemeral: true });
    } else {
      if (user.bot) {
        return interaction.reply({ content: `${language.hackbot}`, ephemeral: true });
      }
    }
    const member = user;
    const mostCommon = [`${language.hack2}`, `${language.hack3}`, `${language.hack3}`, `${language.hack4}`, `${language.hack5}`, `${language.hack6}`];
    const lastdm = [
      `${language.hack7}`,
      `${language.hack8}`,
      `${language.hack9}`,
      `${language.hack10}`
    ];

    interaction.reply({ content: `${language.hack11} "${member.user.username}" ${language.hack12}` })
    .then(async (msg) => {
      setTimeout(async function () {
        await interaction.editReply({ content: `[▘] ${language.hack13}` }).catch(() => {});
      }, 1500);
      setTimeout(async function () {
        await interaction.editReply({ content: `[▝] Email: \`${darkemail({
          domain: "gmail.com",
        })}\`\nPassword: \`${impostorpassword}\`` }).catch(() => {});
      }, 3000);
      setTimeout(async function () {
        await interaction.editReply({ content: `[▖] Last DM: "${lastdm[Math.floor(Math.random() * lastdm.length)]}"` }).catch(() => {});
      }, 4500);
      setTimeout(async function () {
        await interaction.editReply({ content: `[▘] ${language.hack14}` }).catch(() => {});
      }, 6000);
      setTimeout(async function () {
        await interaction.editReply({ content: `[▝] mostCommon = "${mostCommon[Math.floor(Math.random() * mostCommon.length)]}"` }).catch(() => {});
      }, 7500);
      setTimeout(async function () {
        await interaction.editReply({ content: `[▗] Finding IP address...` }).catch(() => {});
      }, 9000)
      setTimeout(async function () {
        await interaction.editReply({ content: 
          `[▖] IP address: \`127.0.0.1:${darkrandom.int(100, 9999)}\``
        }).catch(() => {});
      }, 10500);
      setTimeout(async function () {
        await interaction.editReply({ content: `[▘] ${language.hack15}` }).catch(() => {});
      }, 12000);
      setTimeout(async function () {
        await interaction.editReply({ content: `[▝] ${language.hack16}` }).catch(() => {});
      }, 13500);
      setTimeout(async function () {
        await interaction.editReply({ content: `${language.hack17} ${member.user.username}` }).catch(() => {});
      }, 15000);
      setTimeout(async function () {
        await interaction.followUp({ content: `${language.hack18}` })
      }, 16500);
    });
  }
};