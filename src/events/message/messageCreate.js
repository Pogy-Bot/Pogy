const Event = require("../../structures/Event");
const { Permissions, Collection } = require("discord.js");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const logger = require("../../utils/logger");
const Guild = require("../../database/schemas/Guild");
const User = require("../../database/schemas/User");
const Blacklist = require("../../database/schemas/blacklist");
const maintenanceCooldown = new Set();
const metrics = require("datadog-metrics");
const permissions = require("../../assets/json/permissions.json");
const Maintenance = require("../../database/schemas/maintenance");
const config = require("../../../config.json");
require("moment-duration-format");
require("dotenv").config();

module.exports = class extends Event {
  constructor(...args) {
    super(...args);

    this.impliedPermissions = new Permissions([
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "ADD_REACTIONS",
    ]);

    this.ratelimits = new Collection();
  }

  async run(message) {
    try {
      if (!message.guild) return;

      let metricsEnabled = false;
      if (process.env.DATADOG_API_KEY) {
        metricsEnabled = true;
      }

      const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
      const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);

      if (!message.guild || message.author.bot) return;

      let settings = await Guild.findOne({
        guildId: message.guild.id,
      });

      if (!settings) {
        await Guild.create({
          guildId: message.guild.id,
          prefix: config.prefix,
          language: "english",
        });

        settings = await Guild.findOne({
          guildId: message.guild.id,
        });
      }

      if (message.content.match(mentionRegex)) {
        //if (!settings) return message.channel.sendCustom('Oops, this server was not found in the database. Please try to run the command again now!');

        const proofita = `\`\`\`css\n[     Prefix: ${
          settings.prefix || "!"
        }     ]\`\`\``;
        const proofitaa = `\`\`\`css\n[      Help: ${
          settings.prefix || "!"
        }help    ]\`\`\``;
        const embed = new MessageEmbed()
          .setTitle("Hello, I'm Pogy. What's Up?")
          .addField(`Prefix`, proofita, true)
          .addField(`Usage`, proofitaa, true)
          .setDescription(
            `\nIf you like Pogy, Consider [voting](https://top.gg/bot/767705905235099658), or [inviting](${config.invite_link}) it to your server! Thank you for using Pogy, we hope you enjoy it, as we always look forward to improve the bot`
          )
          .setFooter("Thank you for using Pogy!!")
          .setColor("#FF2C98");
        message.channel.sendCustom(embed);
      }

      // Add increment after every fucking message lmfao!
      if (metricsEnabled) metrics.increment("messages_seen");

      let mainPrefix = settings ? settings.prefix : "!";

      const prefix = message.content.match(mentionRegexPrefix)
        ? message.content.match(mentionRegexPrefix)[0]
        : mainPrefix;

      const userBlacklistSettings = await Blacklist.findOne({
        discordId: message.author.id,
      });
      const guildBlacklistSettings = await Blacklist.findOne({
        guildId: message.guild.id,
      });

      const maintenance = await Maintenance.findOne({
        maintenance: "maintenance",
      });

      if (!message.content.startsWith(prefix)) return;

      // eslint-disable-next-line no-unused-vars
      const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
      const command =
        this.client.botCommands.get(cmd.toLowerCase()) ||
        this.client.botCommands.get(this.client.aliases.get(cmd.toLowerCase()));

      // maintenance mode

      if (!this.client.config.developers.includes(message.author.id)) {
        if (maintenance && maintenance.toggle == "true") {
          if (maintenanceCooldown.has(message.author.id)) return;

          message.channel.sendCustom(
            `Pogy is currently undergoing maintenance which won't allow anyone to access Pogy's Commands. Feel free to try again later. For updates: ${config.discord}`
          );

          maintenanceCooldown.add(message.author.id);
          setTimeout(() => {
            maintenanceCooldown.delete(message.author.id);
          }, 10000);

          return;
        }
      }

      if (command) {
        await User.findOne(
          {
            discordId: message.author.id,
          },
          (err, user) => {
            if (err) console.log(err);

            if (!user) {
              const newUser = new User({
                discordId: message.author.id,
              });

              newUser.save();
            }
          }
        );

        let disabledCommands = settings.disabledCommands;
        if (typeof disabledCommands === "string")
          disabledCommands = disabledCommands.split(" ");

        const rateLimit = this.ratelimit(message, cmd);

        if (
          !message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
        )
          return;

        // Check if user is Blacklisted
        if (userBlacklistSettings && userBlacklistSettings.isBlacklisted) {
          logger.warn(
            `${message.author.tag} tried to use "${cmd}" command but the user is blacklisted`,
            { label: "Commands" }
          );
          return;
        }

        // Check if server is Blacklisted
        if (guildBlacklistSettings && guildBlacklistSettings.isBlacklisted) {
          logger.warn(
            `${message.author.tag} tried to use "${cmd}" command but the guild is blacklisted`,
            { label: "Commands" }
          );
          return;
        }

        let number = Math.floor(Math.random() * 10 + 1);
        if (typeof rateLimit === "string")
          return message.channel
            .sendCustom(
              ` ${
                message.client.emoji.fail
              } Please wait **${rateLimit}** before running the **${cmd}** command again - ${
                message.author
              }\n\n${
                number === 1
                  ? "*Did You know that Pogy has its own dashboard? `https://394wkx-3000.csb.app//dashboard`*"
                  : ""
              }${
                number === 2
                  ? "*You can check our top.gg page at `https://vote.pogy.xyz`*"
                  : ""
              }`
            )
            .then((s) => {
              message.delete().catch(() => {});
              setTimeout(() => {
                s.delete().catch(() => {});
              }, 4000);
            })
            .catch(() => {});

        if (command.botPermission) {
          const missingPermissions = message.channel
            .permissionsFor(message.guild.me)
            .missing(command.botPermission)
            .map((p) => permissions[p]);

          if (missingPermissions.length !== 0) {
            const embed = new MessageEmbed()
              .setAuthor(
                `${this.client.user.tag}`,
                message.client.user.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`<:wrong:822376943763980348> Missing Bot Permissions`)
              .setDescription(
                `Command Name: **${
                  command.name
                }**\nRequired Permission: **${missingPermissions
                  .map((p) => `${p}`)
                  .join(" - ")}**`
              )
              .setTimestamp()
              .setFooter("https://394wkx-3000.csb.app/")
              .setColor(message.guild.me.displayHexColor);
            return message.channel.sendCustom(embed).catch(() => {});
          }
        }

        if (command.userPermission) {
          const missingPermissions = message.channel
            .permissionsFor(message.author)
            .missing(command.userPermission)
            .map((p) => permissions[p]);
          if (missingPermissions.length !== 0) {
            const embed = new MessageEmbed()
              .setAuthor(
                `${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`<:wrong:822376943763980348> Missing User Permissions`)
              .setDescription(
                `Command Name: **${
                  command.name
                }**\nRequired Permission: **${missingPermissions
                  .map((p) => `${p}`)
                  .join("\n")}**`
              )
              .setTimestamp()
              .setFooter("https://394wkx-3000.csb.app/")
              .setColor(message.guild.me.displayHexColor);
            return message.channel.sendCustom(embed).catch(() => {});
          }
        }
        if (disabledCommands.includes(command.name || command)) return;

        if (command.ownerOnly) {
          if (!this.client.config.developers.includes(message.author.id))
            return;
        }

        if (metricsEnabled) metrics.increment("commands_served");

        if (command.disabled)
          return message.channel.sendCustom(
            `The owner has disabled the following command for now. Try again Later!\n\nFor Updates: ${config.discord}`
          );

        await this.runCommand(message, cmd, args).catch((error) => {
          return this.client.emit("commandError", error, message, cmd);
        });
      }
    } catch (error) {
      return this.client.emit("fatalError", error, message);
    }
  }

  async runCommand(message, cmd, args) {
    if (
      !message.channel.permissionsFor(message.guild.me) ||
      !message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")
    )
      return message.channel.sendCustom(
        `${message.client.emoji.fail} Missing bot Permissions - **Embeds Links**`
      );

    const command =
      this.client.botCommands.get(cmd.toLowerCase()) ||
      this.client.botCommands.get(this.client.aliases.get(cmd.toLowerCase()));
    logger.info(
      `"${message.content}" (${command.name}) ran by "${message.author.tag}" (${message.author.id}) on guild "${message.guild.name}" (${message.guild.id}) channel "#${message.channel.name}" (${message.channel.id})`,
      { label: "Command" }
    );

    await command.run(message, args);
  }

  ratelimit(message, cmd) {
    try {
      const command =
        this.client.botCommands.get(cmd.toLowerCase()) ||
        this.client.botCommands.get(this.client.aliases.get(cmd.toLowerCase()));
      if (message.author.permLevel > 4) return false;

      const cooldown = command.cooldown * 1000;
      const ratelimits = this.ratelimits.get(message.author.id) || {}; // get the ENMAP first.
      if (!ratelimits[command.name])
        ratelimits[command.name] = Date.now() - cooldown; // see if the command has been run before if not, add the ratelimit
      const difference = Date.now() - ratelimits[command.name]; // easier to see the difference
      if (difference < cooldown) {
        // check the if the duration the command was run, is more than the cooldown
        return moment
          .duration(cooldown - difference)
          .format("D [days], H [hours], m [minutes], s [seconds]", 1); // returns a string to send to a channel
      } else {
        ratelimits[command.name] = Date.now(); // set the key to now, to mark the start of the cooldown
        this.ratelimits.set(message.author.id, ratelimits); // set it
        return true;
      }
    } catch (e) {
      this.client.emit("fatalError", e, message);
    }
  }
};
