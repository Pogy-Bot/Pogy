const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Profile = require("../../database/models/economy/profile.js");
const { createProfile } = require("../../utils/utils");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "slots",
      description: "Gamble a certain amount of money in slots",
      category: "Economy",
      cooldown: 3,
    });
  }

  async run(message, args) {
    try {
      const bet = parseInt(args[0]);

      // Check if the bet is a valid number
      if (isNaN(bet) || bet <= 0) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription("Please enter a valid bet amount."),
          ],
        });
      }

      const profile = await Profile.findOne({
        userID: message.author.id,
        guildId: message.guild.id,
      });

      // Check if the user has a profile, create one if not
      if (!profile) {
        await createProfile(message.author, message.guild);
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("BLURPLE")
              .setDescription(
                "Creating profile. Use this command again to gamble."
              ),
          ],
        });
      }

      // Check if the user has enough money to place the bet
      if (profile.wallet < bet) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription("You don't have enough money to place that bet."),
          ],
        });
      }

      // Your slots logic goes here
      // For example, you can randomly generate slots and determine the outcome

      // Update the user's profile based on the outcome
      const outcome = Math.random() > 0.35 ? "win" : "lose";
      const winnings = outcome === "win" ? bet * 2 : 0;

      await Profile.updateOne(
        { userID: message.author.id, guildId: message.guild.id },
        {
          $inc: {
            wallet: outcome === "win" ? winnings : -bet,
          },
        }
      );

      // Send a message with the outcome
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(outcome === "win" ? "GREEN" : "RED")
            .setTitle(`${message.author.username}'s Slots Game`)
            .setDescription(
              outcome === "win"
                ? `Congratulations! You won $${winnings}.`
                : `Better luck next time. You lost $${bet}.`
            ),
        ],
      });
    } catch (error) {
      console.error("Error occurred:", error);
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("An error occurred while processing the command."),
        ],
      });
    }
  }
};
