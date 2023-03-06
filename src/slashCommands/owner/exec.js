const { SlashCommandBuilder } = require("@discordjs/builders");
const { exec } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("exec")
  .setDescription("This is for the developers")
  .addStringOption((option) => option.setName("thing-to-exec").setDescription("The thing to execute").setRequired(true)),
  async execute(interaction) {
    const thing = interaction.options.getString("thing-to-exec")

    if(!interaction.client.config.developers.includes(interaction.member.id)) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | You are not the developer of this bot.`)
        ], ephemeral: true
      })
    }
    
    if (thing.toLowerCase().includes("config.json")) return interaction.reply({ content: "Due to privacy reasons, we can't show the config.json file." })

    if(thing.length < 1) return interaction.reply({ content: "You have to give me some text to execute!" })

    interaction.reply({ content: `Please wait while the command is being processed... This may take a while.`, fetchReply: true, ephemeral: true });

    exec(thing, (error, stdout) => {
      const response = stdout || error;
      interaction.editReply({ content: `${response}`, ephemeral: true })
    })
  }
}