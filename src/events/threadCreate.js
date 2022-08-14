const Event = require("../structures/Event");
module.exports = class extends Event {
  async run(thread) {
    try {
      await thread.join();
    } catch (err) {
      //nothing
    }
  }
};
