require('dotenv').config()
const mongoose = require("mongoose");
const logger = require("./logger");

module.exports = {
  init: async () => {
    mongoose.Promise = global.Promise;

    mongoose.connection.on("err", (err) => {
      logger.error(`Mongoose connection error: ${err.stack}`, {
        label: "Database",
      });
    });

    mongoose.connection.on("disconnected", () => {
      logger.error(`Mongoose connection lost`, { label: "Database" });
    });

    mongoose.connection.on("connected", () => {
      logger.info(`Mongoose connection connected`, { label: "Database" });
    });

    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);

    await mongoose
      .connect(process.env.MONGO)
      .catch((e) => {
        logger.error(e.message, { label: "Database" });
        process.exit(1);
      });

    return true;
  },
};
