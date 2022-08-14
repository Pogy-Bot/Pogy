const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "nuke",
      description: "nuke a server (FAKE) !",
      category: "Fun",
      cooldown: 3,
    });
  }

  async run(message) {
    message.channel
      .sendCustom(
        `https://tenor.com/view/explosion-mushroom-cloud-atomic-bomb-bomb-boom-gif-4464831`
      )
      .catch(() => {});
    message.react("790133942095183873").catch(() => {});
  }
};
