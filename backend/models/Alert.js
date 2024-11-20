const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  device_id: { type: String, required: true },
  alert_type: { type: String, required: true },
  status: { type: String, enum: ["active", "resolved"], default: "active" },
  created_at: { type: Date, default: Date.now },
  resolved_at: { type: Date },
});

module.exports = mongoose.model("Alert", AlertSchema);
