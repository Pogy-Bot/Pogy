const { MessageActionRow, MessageButton } = require('discord.js');
const Command = require("../../structures/Command");

module.exports = class MadCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "mad",
      aliases: [],
      description: "Create a Mad Libs story.",
      category: "Fun",
      cooldown: 5,
    });
  }

  async run(message) {
    const collectedWords = {
      noun: "",
      verb: "",
      adjective: "",
    };

    const askForWord = async (wordType) => {
      const row = new MessageActionRow().addComponents(
        new MessageButton().setCustomId(`confirm_${wordType}`).setLabel('Confirm').setStyle('SUCCESS'),
        new MessageButton().setCustomId(`retry_${wordType}`).setLabel('Retry').setStyle('PRIMARY'),
      );

      const sentMessage = await message.channel.send(`Enter a ${wordType}:`, { components: [row] });

      const filter = (i) => i.user.id === message.author.id;
      const collector = sentMessage.createMessageComponentCollector({ filter, time: 30000 });

      return new Promise((resolve, reject) => {
        collector.on('collect', async (i) => {
          if (i.customId === `confirm_${wordType}`) {
            collector.stop();
            resolve(collectedWords[wordType]);
          } else if (i.customId === `retry_${wordType}`) {
            collector.stop();
            const response = await askForWord(wordType);
            collectedWords[wordType] = response;
          }
        });

        collector.on('end', (collected, reason) => {
          if (reason === 'time') {
            reject(`Time is up! ${wordType} not provided.`);
          }
        });
      });
    };

    // Ask for each word type
    collectedWords.noun = await askForWord("noun");
    collectedWords.verb = await askForWord("verb");
    collectedWords.adjective = await askForWord("adjective");

    // Display the Mad Libs story
    if (collectedWords.noun && collectedWords.verb && collectedWords.adjective) {
      message.channel.send(`The ${collectedWords.adjective} ${collectedWords.noun} ${collectedWords.verb} and was very ${collectedWords.adjective}.`);
    }
  }
};
