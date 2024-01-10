const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const emojis = require("../../assets/emojis.json");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows every command the bot has"),
  async execute(interaction) {
    const emoji = {
      information: `${emojis.information}`,
      moderation: `${emojis.moderation}`,
      fun: `${emojis.fun}`,
      owner: `${emojis.owner}`,
      config: `${emojis.config}`,
    };
    const client = interaction.client;
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Select your option")
      .addOptions([
        {
          label: `Config`,
          description: "Click to see config commands",
          value: "first",
        },
        {
          label: `Fun`,
          description: "Click to see fun commands",
          value: "second",
        },

        {
          label: `Information`,
          description: "Click to see information commands",
          value: "third",
        },

        {
          label: `Moderation`,
          description: "Click this to see fun commands",
          value: "fourth",
        },

        {
          label: `Owner`,
          description: "Click this to view owner commands (OWNER ONLY)",
          value: "fifth",
        },

        {
          label: `Utility`,
          description: "Click this to view utility commands",
          value: "sixth"
        },

        {
          label: `Home`,
          description: "Click this to go back to the home page",
          value: "seventh"
        },
      ])
    );

    let embed = new MessageEmbed()
    .setTitle(`Pogy's slash commands`)
    .setDescription(`Choose a category from the list below`)
    .addFields(
      { name: `${emojis.config} Config`, value: "Config Category", inline: true },
      { name: `${emojis.fun} Fun`, value: "Fun Category", inline: true },
      { name: `${emojis.information} Information`, value: "Information Category", inline: true },
      { name: `${emojis.moderation} Moderation`, value: "Moderation Category", inline: true },
      { name: `${emojis.owner} Owner`, value: "Owner Category", inline: true },
      { name: `${emojis.utility} Utility`, value: "Utility Category", inline: true },
      { name: "\u200b", value: "**[Invite](https://invite.Pogy.ml) | " + "[Support Server](https://Pogy.ml/support) | " + "[Dashboard](https://Pogy.ml/dashboard)**" }
    )
    .setColor("GREEN")
    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setTimestamp();
    
    let editEmbed = new MessageEmbed()
      .addFields(
          { name: "\u200b", value: "**[Invite](https://invite.Pogy.ml) | " + "[Support Server](https://Pogy.ml/support) | " + "[Dashboard](https://Pogy.ml/dashboard)**" }
        )
      .setTimestamp();

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
        let _commands = '';
        const commandFiles = fs.readdirSync(`./src/slashCommands/config`).filter((file) => file.endsWith(".js"));

        for(const file of commandFiles) {
          const command = require(`../config/${file}`);
          _commands += `- \`${command.data.name}\` - ${command.data.description} \n`
        }

        editEmbed.setDescription(_commands)
        .setColor("GREEN")
        .setTitle(`${emojis.config} Config Commands`)
        .setFooter({ text: `Requested by ${interaction.user.tag} | Total Config commands: ${commandFiles.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        return await interaction.editReply({ embeds: [editEmbed] });
      }

      if (value === "second") {
        let _commands = '';
        const commandFiles = fs.readdirSync(`./src/slashCommands/fun`).filter((file) => file.endsWith(".js"));

        for(const file of commandFiles) {
          const command = require(`../fun/${file}`);
          _commands += `- \`${command.data.name}\` - ${command.data.description} \n`
        }
        editEmbed.setDescription(_commands)
        .setColor("GREEN")
        .setTitle(`${emojis.fun} Fun Commands`)
        .setFooter({ text: `Requested by ${interaction.user.tag} | Total Fun Commands: ${commandFiles.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true}) });
        return await interaction.editReply({ embeds: [editEmbed] });
      }

      if (value === "third") {
        let _commands = '';
        const commandFiles = fs.readdirSync(`./src/slashCommands/information`).filter((file) => file.endsWith(".js"));

        for(const file of commandFiles) {
          const command = require(`./${file}`);
          _commands += `- \`${command.data.name}\` - ${command.data.description} \n`
        }
        editEmbed.setColor(client.color.green)
        .setDescription(_commands)
        .setTitle(`${emojis.information} Information Commands`)
        .setFooter({ text: `Requested by ${interaction.user.tag} | Total Information Commands: ${commandFiles.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        return await interaction.editReply({ embeds: [editEmbed] });
      }

      if (value === "fourth") {
        let _commands = '';
        const commandFiles = fs.readdirSync(`./src/slashCommands/moderation`).filter((file) => file.endsWith(".js"));

        for(const file of commandFiles) {
          const command = require(`../moderation/${file}`);
          _commands += `- \`${command.data.name}\` - ${command.data.description} \n`
        }
        editEmbed.setColor(client.color.green)
        .setDescription(_commands)
        .setTitle(`${emojis.moderation} Moderation Commands`)
        .setFooter({ text: `Requested by ${interaction.user.tag} | Total Moderation Commands: ${commandFiles.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        return await interaction.editReply({ embeds: [editEmbed] });
      }

      if (value === "fifth") {
        if(!client.config.developers.includes(interaction.member.id)) {
          editEmbed.setColor(client.color.red)
          .setDescription(`${client.emoji.fail} | You are not allowed to view this category.`)
          .setTitle(`You are not owner >:(`);
          return await interaction.editReply({ embeds: [editEmbed] })
        } else {
        let _commands = '';
        const commandFiles = fs.readdirSync(`./src/slashCommands/owner`).filter((file) => file.endsWith(".js"));

        for(const file of commandFiles) {
          const command = require(`../owner/${file}`);
          _commands += `- \`${command.data.name}\` - ${command.data.description} \n`
        }
        editEmbed.setColor(client.color.green)
        .setDescription(_commands)
        .setTitle(`${emojis.owner} Owner Commands`)
        .setFooter({ text: `Requested by ${interaction.user.tag} | Total Owner Commands: ${commandFiles.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        return await interaction.editReply({ embeds: [editEmbed] });
        }
      }

      if (value === "sixth") {
        let _commands = '';
        const commandFiles = fs.readdirSync(`./src/slashCommands/utility`).filter((file) => file.endsWith(".js"));

        for(const file of commandFiles) {
          const command = require(`../utility/${file}`);
          _commands += `- \`${command.data.name}\` - ${command.data.description} \n`
        }
        editEmbed.setColor(client.color.green)
        .setDescription(_commands)
        .setTitle(`${emojis.utility} Utility Commands`)
        .setFooter({ text: `Requested by ${interaction.user.tag} | Total Utility Commands: ${commandFiles.length}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        return await interaction.editReply({ embeds: [editEmbed] })
      }
      
      if (value === "seventh") {
        interaction.editReply({ embeds: [embed] });
      }
    });
  }
}