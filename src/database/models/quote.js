const mongoose = require("mongoose");

const quoteSchema = mongoose.Schema({
  serverID: { type: String, required: true },
  userID: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorID: { type: String, required: true },
  authorAvatar: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quote", quoteSchema);
