const Command = require("../../structures/Command");


module.exports = class EmptyCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "wouldyourather", 
      aliases: [], 
      description: "wouldyourather",
      category: "General",
      cooldown: 5,
   
    });
  }

  async run(message) {
    try {
        const { WouldYouRather } = require('falgames');
        const Game = new WouldYouRather({
            message: message,
            isSlashGame: false,
            embed: {
              title: 'Would You Rather',
              color: '#551476',

            },
            buttons: {
              option1: 'Option 1',
              option2: 'Option 2',
            },
            timeoutTime: 60000,
            errMessage: 'Unable to fetch question data! Please try again.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          
          Game.startGame();
    } catch (error) {
      console.error("Error in the empty command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};