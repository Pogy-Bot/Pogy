const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const discord = require("discord.js");
const reactionTicket = require("../../database/models/tickets.js");
const transcriptSchema = require("../../database/models/transcript.js");
const randoStrings = require("../../packages/randostrings.js");
const random = new randoStrings();
const moment = require("moment");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "closeticket",
      aliases: ["close", "ticketclose", "tclose"],
      description: "Close an Opened Ticket!",
      category: "Tickets",
      cooldown: 3,
      botPermission: ["MANAGE_CHANNELS"],
    });
  }

  async run(message, args) {
    if (!message.channel.name.startsWith("ticket-"))
      return message.channel
        .sendCustom({
          embeds: [
            new MessageEmbed()
              .setColor("PURPLE")
              .setTitle("Close a ticket")
              .setDescription(
                `Unable to close ticket, it seems like you aren't in any ticket channel.`
              )
              .setFooter({ text: "https://pogy.xyz/" })
              .setTimestamp(),
          ],
        })
        .then((m) => {
          message.delete();
          setTimeout(() => {
            m.delete();
          }, 10000);
        });

    await reactionTicket.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, db) => {
        if (!db) return;

        let channelReact = message.guild.channels.cache.get(db.ticketModlogID);

        let reason = args.slice(0).join(" ");
        if (!reason) reason = "No reason Was Provided";

        const role = message.guild.roles.cache.get(db.supportRoleID);
        if (db.ticketClose == "false") {
          if (role) {
            if (
              !message.member.roles.cache.find(
                (r) => r.name.toLowerCase() === role.name.toLowerCase()
              )
            )
              return message.channel.sendCustom({
                embeds: [
                  new discord.MessageEmbed()
                    .setAuthor(
                      `${message.author.tag}`,
                      message.author.displayAvatarURL({ format: "png" })
                    )
                    .setDescription(
                      `${message.client.emoji.fail} Only users with the support team role Can Close this Ticket`
                    )
                    .setFooter({ text: "https://pogy.xyz/" })
                    .setTimestamp()
                    .setColor("RED"),
                ],
              });
          }
        }

        if (!message.channel) return;

        await message.channel.messages.fetch().then(async (messages) => {
          let ticketID = random.password({
            length: 8,
            string: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
          });

          const paste = new transcriptSchema({
            _id: ticketID,
            type: "ticket",
            by: message.author.id,
            expiresAt: new Date(Date.now() + 1036800000),
          });

          if (messages) {
            for (const message of messages
              .map((a) => {
                return {
                  content: a.content,
                  author: a.author,
                  embeds: a.embeds,
                };
              })
              .reverse()) {
              if (message && message.content && message.author.id) {
                paste.paste.push(`${message.content}`);
                paste.paste2.push(message.author.id);
              } else if (message && message.embeds && message.author.id) {
                paste.paste.push(`(embed sent)`);
                paste.paste2.push(message.author.id);
              }
            }
          }

          if (channelReact) {
            let color2 = db.ticketLogColor;
            if (color2 == "#000000") color2 = `#36393f`;

            let closeEmbed = new MessageEmbed()
              .setColor(color2)
              .setTitle("Ticket Closed")
              .addField(
                "Information",
                `**User:** ${message.author}\n**Ticket Channel:** #${
                  message.channel.name
                }\n**Reason:** ${reason}\n**Date:** ${moment(new Date()).format(
                  "dddd, MMMM Do YYYY"
                )}\n**Transcript:** [here](https://pogy.xyz/paste/${ticketID})`
              );

            channelReact.send({ embeds: [closeEmbed] });
            message.author.send({ embeds: [closeEmbed] });
          }

          await paste.save();
        });

        message.channel.send("closing ticket...");
        setTimeout(() => {
          message.channel.delete();
        }, 2000);
      }
    );
  }
};
