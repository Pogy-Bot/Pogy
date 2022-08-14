const mongoose = require("mongoose");

const paste = new mongoose.Schema(
  {
    _id: { type: String },
    type: { type: String },
    by: { type: String },
    status: { type: String, default: null },
    paste: { type: Array },
    paste2: { type: Array },
    expiresAt: { type: Date, expires: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Paste", paste);
