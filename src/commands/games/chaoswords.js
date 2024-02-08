const Command = require("../../structures/Command");


module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "chaoswords", 
      aliases: [], 
      description: "Empty command template.",
      category: "General",
      cooldown: 5,
   
    });
  }

  async run(message) {
    try {
      const { ChaosWords } = require("weky");
        await ChaosWords({
            message: message,
            embed: {
                title: 'ChaosWords | Weky Development',
                description: 'You have **{{time}}** to find the hidden words in the below sentence.',
                color: '#5865F2',
                field1: 'Sentence:',
                field2: 'Words Found/Remaining Words:',
                field3: 'Words found:',
                field4: 'Words:',
                footer: 'chaotic',
                timestamp: true
            },
            winMessage: 'GG, You won! You made it in **{{time}}**.',
            loseMessage: 'Better luck next time!',
            wrongWordMessage: 'Wrong Guess! You have **{{remaining_tries}}** tries left.',
            correctWordMessage: 'GG, **{{word}}** was correct! You have to find **{{remaining}}** more word(s).',
            time: 60000,
            words: ['hello', 'these', 'are', 'words'],
            charGenerated: 17,
            maxTries: 10,
            buttonText: 'Cancel',
            othersMessage: 'Only <@{{author}}> can use the buttons!'
        });
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};