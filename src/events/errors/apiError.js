const Event = require("../../structures/Event");

module.exports = class extends Event {
  async run(error, message) {
    console.log(error);

    message.channel.sendCustom(`An API Error has occured, try again later!`);
  }
};
