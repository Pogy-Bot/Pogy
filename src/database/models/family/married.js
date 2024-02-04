const mongoose = require("mongoose");

const maried = mongoose.Schema({
  userID: { type: String },
  serverId: { type: String },
  mariedId: { type: String },
});
// me lazy 
module.exports = mongoose.model("maried", maried);
