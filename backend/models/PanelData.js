const mongoose = require("mongoose");

const PanelDataSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    current: {
      type: Number,
      required: true,
    },
    voltage: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    dust_level: {
      type: Number,
      required: true,
    },
    performance_score: {
      type: Number,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PanelData", PanelDataSchema);
