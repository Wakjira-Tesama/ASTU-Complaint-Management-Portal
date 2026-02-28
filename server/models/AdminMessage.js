const mongoose = require("mongoose");

const AdminMessageSchema = new mongoose.Schema({
  department: { type: String, required: true },
  senderRole: { type: String, enum: ["admin", "staff"], required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AdminMessage", AdminMessageSchema);
