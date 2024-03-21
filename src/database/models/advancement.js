const mongoose = require("mongoose");

const advancementSchema = mongoose.Schema({
  userID: { type: String },
  serverID: { type: String },
  advancements: { type: Array, default: [] },
  messageCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Advancement", advancementSchema);
