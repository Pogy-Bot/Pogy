const mongoose = require("mongoose");

const levelSchema = mongoose.Schema({
  guildId: { type: String },
  userID: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  messageTimeout: { type: Date },
  username: { type: String },
  background: { type: String },
  levelingEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model("levels", levelSchema);
