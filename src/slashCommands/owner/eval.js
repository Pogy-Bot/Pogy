const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("eval")
  .setDescription("This is for the developers.")
  .addStringOption((option) => option.setName("thing-to-eval").setDescription("Thing to eval").setRequired(true)),
  async execute(interaction) {
    const input = interaction.options.getString("thing-to-eval")

    if(!interaction.client.config.developers.includes(interaction.member.id)) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(interaction.client.color.red)
          .setDescription(`${interaction.client.emoji.fail} | You are not the developer of this bot.`)
        ], ephemeral: true
      })
    }
    
    if(!input) return interaction.reply(`What do I evaluate?`);
    if(!input.toLowerCase().includes("token")) {
      let embed = ``;

      try {
        let output = eval(input);
        if (typeof output !== "string")
          output = require("util").inspect(output, { depth: 0 });

        embed = `\`\`\`js\n${
          output.length > 1024 ? "Too large to display." : output
        }\`\`\``;
      } catch (err) {
        embed = `\`\`\`js\n${
          err.length > 1024 ? "Too large to display." : err
        }\`\`\``;
      }

      interaction.reply(embed);
    } else {
      interaction.reply("Bruh you tryina steal my token huh?");
    }
  }
};