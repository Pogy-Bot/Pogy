const Command = require("../../structures/Command");
const { Snake } = require('discord-gamecord');

module.exports = class SnakeCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "snake",
      aliases: [],
      description: "Play the Snake game.",
      category: "Games",
      cooldown: 5,
    });
  }

  async run(message) {
    try {
      const Game = new Snake({
        message: message,
        isSlashGame: false,
        embed: {
          title: 'Snake Game',
          overTitle: 'Game Over',
          color: '#5865F2'
        },
        emojis: {
          board: '⬛',
          food: '🍎',
          up: '⬆️',
          down: '⬇️',
          left: '⬅️',
          right: '➡️',
        },
        stopButton: 'Stop',
        timeoutTime: 60000,
        snake: { head: '🟢', body: '🟩', tail: '🟢', over: '💀' },
        foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });

      Game.startGame();
      Game.on('gameOver', result => {
        console.log(result);
      });

    } catch (error) {
      console.error("Error in the Snake command:", error);
      message.channel.send("An error occurred. Please try again later.");
    }
  }
};
