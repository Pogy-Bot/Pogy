const Command = require("../../structures/Command");
const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "fetchinvite",
      aliases: ["finvite", "finv"],
      description: "Fetch an invite!",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return message.channel.sendCustom(`Provide a guild`);
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.sendCustom(`Invalid guild ID`);

    var textChats = guild.channels.cache.find(
      (ch) =>
        ch.type === "GUILD_TEXT" &&
        ch.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE")
    );

    if (!textChats) message.channel.sendCustom(`No channel`);

    await textChats
      .createInvite({
        maxAge: 0,
        maxUses: 0,
      })
      .then((inv) => {
        console.log(`${guild.name} | ${inv.url}`);
        message.channel.sendCustom(`${guild.name} | ${inv.url}`);
      })
      .catch(() => {
        message.channel.sendCustom("Don't have permission");
      });
  }
};
