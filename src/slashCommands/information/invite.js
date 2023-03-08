const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const Guild = require("../../database/schemas/Guild");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Sends you the invite to MEE8's support server or the bots invite"),
  async execute(interaction) {
    const guildDB = await Guild.findOne({
      guildId: interaction.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);
    const client = interaction.client;
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Select your option")
      .addOptions([
        {
          label: "Support Server Invite",
          description: "Click to get invited to the support server",
          value: "first"
        },
        {
          label: "Bot Invite",
          description: "Click to invite the official bot",
          value: "second"
        },
      ])
    );

    let embed = new MessageEmbed()
    .setDescription("Select the option below to view the different invite links")
    .setColor("RANDOM");

    let editEmbed = new MessageEmbed();

    let sendmsg = await interaction.reply({
      content: " ",
      embeds: [embed],
      ephemeral: true,
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      time: 60000,
      idle: 60000/2,
    });
    collector.on("end", async () => {
      await interaction.editReply({ components: [] })
    })

    collector.on("collect", async (collected) => {
      if(!collected.deffered) await collected.deferUpdate()
      const value = collected.values[0];

      if (value === "first") {
        editEmbed.setDescription("Click [here](https://discord.gg/gGCTeCx2TS) to join the support server")
        .setColor(client.color.green)
        return await interaction.editReply({ embeds: [editEmbed] });
      }

      if (value === "second") {
        editEmbed.setDescription(`${language.invite}(https://discord.com/api/oauth2/authorize?client_id=1001140963818864750&permissions=4398046511103&scope=bot%20applications.commands) ${client.emoji.success}`)
        .setColor(client.color.green)
        return await interaction.editReply({ embeds: [editEmbed] });
      }
    });
  }
}