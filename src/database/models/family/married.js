const mongoose = require("mongoose");

const maried = mongoose.Schema({
  userID: { type: String },
  serverId: { type: String },
  mariedId: { type: String },
  username: { type: String },
  mariedAvatar: { type: String },
userAvatar: { type: String },
  timestamp: { type: String, default: Date.now() },
});
// me lazy 
module.exports = mongoose.model("maried", maried);
// saying somthigng so it commitsgt