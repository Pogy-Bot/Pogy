const mongoose = require("mongoose");

const notes = mongoose.Schema({
  userID: { type: String },
  content: { type: Array, default: [] },
  timestamp: { type: Date, default: Date.now },
  guildID: { type: String },
  username: { type: String },
});

module.exports = mongoose.model("note", notes);
