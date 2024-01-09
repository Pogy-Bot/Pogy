const { SlashCommandBuilder } = require("@discordjs/builders");
const User = require("../../database/schemas/User");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("addbadge")
  .setDescription("Add a badge to a user")
  .addStringOption((option) => option.setName("badge").setDescription("The badge to add").setRequired(true))
  .addUserOption((option) => option.setName("member").setDescription("The member to give the badge to")),
  async execute(interaction) {
    const client = interaction.client;

    let user = interaction.options.getMember("member") || interaction.member;

    if (!user) return interaction.reply({ content: "Provide me with a user.", ephemeral: true });

    const badge = interaction.options.getString("badge");
    if (!badge) return interaction.reply({ content: "Provide me with a badge", ephemeral: true });

    let userFind = await User.findOne({
      discordId: user.id,
    });

    if (!userFind) {
      const newUser = new User({
        discordId: interaction.member.id,
      });

      newUser.save();
      userFind = await User.findOne({
        discordId: user.id,
      });
    }

    if (userFind.badges && userFind.badges.includes(badge)) return interaction.reply({ content: `They already have that badge`, ephemeral: true });

    userFind.badges.push(badge);
    await userFind.save().catch(() => {});
    interaction.reply({ content: `Added the "${badge}" badge to the user!`, ephemeral: true });
  }
};
