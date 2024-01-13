const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");
const { RockPaperScissors } = require("weky");

module.exports = class RPSCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "rps",
      aliases: ["RockPaperScissors", "rps", "rockpaperscissors",],
      description: "Play a game of Rock Paper Scissors against the bot.",
      category: "Games",
      cooldown: 5,
    });
    this.choices = ['rock', 'paper', 'scissors'];
    this.emojis = {
      rock: "✊",
      paper: "✋",
      scissors: "✌️",
    };
  }

  async run(message) {
    try {
      // Create a row with buttons for each choice
      const row = new MessageActionRow()
        .addComponents(
          this.choices.map((choice) =>
            new MessageButton()
              .setCustomId(choice)
              .setLabel(choice.charAt(0).toUpperCase() + choice.slice(1))
              .setStyle("PRIMARY")
          )
        );

      // Create the initial game embed
      const embed = new MessageEmbed()
        .setColor("#00FF00")
        .setTitle("Rock Paper Scissors")
        .setDescription("Choose your move:")
        .addField("Rock", `${this.emojis['rock']} (React with rock)`, true)
        .addField("Paper", `${this.emojis['paper']} (React with paper)`, true)
        .addField("Scissors", `${this.emojis['scissors']} (React with scissors)`, true);

      // Send the initial embed and row of buttons
      const gameMessage = await message.reply({ embeds: [embed], components: [row] });

      // Collect the user's choice
      const filter = (interaction) =>
        interaction.user.id === message.author.id && this.choices.includes(interaction.customId);
      const collector = gameMessage.createMessageComponentCollector({ filter, max: 1, time: 15000 });

      collector.on("collect", async (interaction) => {
        const userChoice = interaction.customId;
        const botChoice = this.choices[Math.floor(Math.random() * this.choices.length)];

        // Format the choices with emojis
        const userChoiceEmoji = this.emojis[userChoice];
        const botChoiceEmoji = this.emojis[botChoice];

        // Send the final result embed
        embed
          .setTitle("Rock Paper Scissors")
          .setDescription(`You chose ${userChoiceEmoji}, and the bot chose ${botChoiceEmoji}.`);

        let resultMessage;
        if (userChoice === botChoice) {
          resultMessage = "It's a tie!";
        } else {
          const userWins = (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
          );
          resultMessage = userWins ? "You win!" : "You lose!";
          embed.addField("Result", `${resultMessage} ${this.emojis[userChoice]} beats ${this.emojis[botChoice]}`);
        }

        await interaction.reply({ embeds: [embed]});

        collector.stop();
      });

      collector.on("end", () => {
        row.components.forEach((button) => button.setDisabled(true));
        gameMessage.edit({ components: [row] });
      });
    } catch (error) {
      console.error("Error in the RPS command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};