const Command = require("../../structures/Command");
const { Fishy } = require('falgames');

module.exports = class SnakeCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "tictactoe",
      aliases: [],
      description: "Play the Snake game.",
      category: "Games",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      
      const { TicTacToe } = require('discord-gamecord');

      const Game = new TicTacToe({
        message: message,
        isSlashGame: false,
        opponent: message.mentions.users.first(),
        embed: {
          title: 'Tic Tac Toe',
          color: '#5865F2',
          statusTitle: 'Status',
          overTitle: 'Game Over'
        },
        emojis: {
          xButton: '❌',
          oButton: '🔵',
          blankButton: '➖'
        },
        mentionUser: true,
        timeoutTime: 60000,
        xButtonStyle: 'DANGER',
        oButtonStyle: 'PRIMARY',
        turnMessage: '{emoji} | Its turn of player **{player}**.',
        winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
        tieMessage: 'The Game tied! No one won the Game!',
        timeoutMessage: 'The Game went unfinished! No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
      });
      
      Game.startGame();
      Game.on('gameOver', result => {
        console.log(result);  // =>  { result... }
      })
    } catch (error) {
      console.error("Error in the Snake command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};