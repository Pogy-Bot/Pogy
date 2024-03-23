const mongoose = require("mongoose");

let profile = new mongoose.Schema({
  guildId: { type: String },
  userID: { type: String },
  wallet: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastDaily: { type: Date },
  lastWeekly: { type: Date },
  lastMonthly: { type: Date },
  lastBeg: { type: Date },
  lastRob: { type: Date },
  passiveUpdated: { type: Date }
});

module.exports = mongoose.model("profile", profile);