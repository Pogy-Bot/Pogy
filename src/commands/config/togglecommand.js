const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "togglecommand",
      description: "Disable or enable commands in the guild",
      category: "Config",
      examples: ["togglecommand rob"],
      cooldown: 3,
      guildOnly: true,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const success = message.client.emoji.success;
    const fail = message.client.emoji.fail;

    if (!args[0])
      return message.channel.sendCustom(`What command do i disable?`);

    const command =
      this.client.commands.get(args[0]) || this.client.aliases.get(args[0]);

    if (!command || (command && command.category == "Owner"))
      return message.channel.sendCustom("Provide a valid command!");

    if (command && command.category === "Config")
      return message.channel.sendCustom(
        `${fail} You may not disable Configuration Commands.`
      );

    let disabled = guildDB.disabledCommands;
    if (typeof disabled === "string") disabled = disabled.split(" ");

    let description;

    if (!disabled.includes(command.name || command)) {
      guildDB.disabledCommands.push(command.name || command);
      description = `The \`${
        command.name || command
      }\` command has been successfully **disabled**. ${fail}`;
    } else {
      removeA(disabled, command.name || command);
      description = `The \`${
        command.name || command
      }\` command has been successfully **enabled**. ${success}`;
    }
    await guildDB.save().catch(() => {});

    const disabledCommands =
      disabled.map((c) => `\`${c}\``).join(" ") || "`None`";

    const embed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField("Disabled Commands", disabledCommands, true)
      .setFooter({ text: "https://pogy.xyz/" })
      .setTimestamp()
      .setColor(message.client.color.green);
    message.channel.sendCustom({ embeds: [embed] }).catch(() => {
      const errorEmbed = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
        .setDescription(description)
        .addField("Disabled Commands", `[Too Large to Display]`, true)
        .setFooter({ text: "https://pogy.xyz/" })
        .setTimestamp()
        .setColor(message.client.color.green);
      message.channel.sendCustom(errorEmbed).catch(() => {});
    });
  }
};
function removeA(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}
