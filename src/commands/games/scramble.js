const Command = require("../../structures/Command");

module.exports = class WordScrambleCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "wordscramble",
      aliases: ["scramble"],
      description: "Word scramble game.",
      category: "Games",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      // Define an array of words for the game
      const words = ["cat", "dog", "elephant", "banana", "computer", "orange", "guitar"];

      const randomIndex = Math.floor(Math.random() * words.length);
      const word = words[randomIndex];
      const scrambledWord = scrambleWord(word);

      const questionEmbed = {
        color: "#00FF00",
        title: "Word Scramble",
        description: `Unscramble the following word:\n\n**${words.randomIndex}**`,
        footer: {
          text: "Reply with your answer. You have 15 seconds.",
        },
      };

      await message.channel.send({ embed: questionEmbed });

      const collector = message.channel.createMessageCollector({
        filter: (response) => response.author.id === message.author.id,
        max: 1,
        time: 15000,
        errors: ["time"],
      });

      collector.on("collect", (response) => {
        const userAnswer = response.content.toLowerCase();

        if (userAnswer === word) {
          response.channel.send("Correct! You unscrambled the word correctly.");
        } else {
          response.channel.send(`Incorrect! The word is **${word}**.`);
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          message.channel.send(`Time's up! The correct word is **${word}**.`);
        }
      });

    } catch (error) {
      console.error("Error in the word scramble game:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};

// Function to scramble the word
function scrambleWord(word) {
  const wordArray = word.split("");
  for (let i = wordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
  }
  return wordArray.join("");
}