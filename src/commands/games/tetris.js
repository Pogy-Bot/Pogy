const Command = require("../../structures/Command");


/// ignore!!
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class TetrisCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: "tetris",
      description: "Play Tetris!",
      category: "Games",
      cooldown: 5,
      guildOnly: true,
    });
  }

  async run(message) {
    try {
      const activeGames = this.client.activeGames || new Map();
      const user = message.author;

      // Check if the user already has an active game
      if (activeGames.has(user.id)) {
        return message.reply('You already have an active Tetris game!');
      }

      const tetrisGame = new TetrisGame();
      activeGames.set(user.id, tetrisGame);

      // Display the initial Tetris grid
      const initialGrid = tetrisGame.getGrid();
      const gridMessage = await message.channel.send(`\`\`\`${initialGrid}\`\`\``);

      // Add buttons for user input
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId('left')
          .setLabel('Left')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('rotate')
          .setLabel('Rotate')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('right')
          .setLabel('Right')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('down')
          .setLabel('Down')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('end')
          .setLabel('End Game')
          .setStyle('DANGER'),
      );

      message.channel.send({ components: [row] }).then(() => {
        // Handle button interactions
        const filter = (interaction) => {
          interaction.deferUpdate();
          return interaction.customId === 'left' || 'rotate' || 'right' || 'down' || 'end';
        };

        const collector = message.channel.createMessageComponentCollector({ filter, time: 600000 });

        collector.on('collect', (interaction) => {
          const tetrisGame = activeGames.get(user.id);

          switch (interaction.customId) {
            case 'left':
              tetrisGame.moveLeft();
              break;
            case 'rotate':
              tetrisGame.rotate();
              break;
            case 'right':
              tetrisGame.moveRight();
              break;
            case 'down':
              tetrisGame.moveDown();
              break;
            case 'end':
              collector.stop();
              activeGames.delete(user.id);
              return message.channel.send('Game ended.');
          }

          const updatedGrid = tetrisGame.getGrid();
          interaction.editReply(`\`\`\`${updatedGrid}\`\`\``);
        });

        collector.on('end', () => {
          activeGames.delete(user.id);
          message.channel.send('The Tetris game has ended.');
        });
      });
    } catch (error) {
      console.error("Error occurred:", error);
      message.reply('An error occurred while playing Tetris.');
    }
  }
};
