const mongoose = require("mongoose");

const PanelMetricsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    device_id: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    current_output: {
      type: Number,
      required: true,
      default: 0,
    },
    peak_output: {
      type: Number,
      required: true,
      default: 0,
    },
    system_efficiency: {
      type: Number,
      required: true,
      default: 0,
    },
    temperature: {
      type: Number,
      required: true,
      default: 0,
    },
    energy_saved: {
      type: Number,
      required: true,
      default: 0,
    },
    alerts_count: {
      type: Number,
      default: 0,
    },
    hourly_output: [
      {
        time: String,
        output: Number,
        efficiency: Number,
      },
    ],
    daily_production: [
      {
        day: String,
        value: Number,
      },
    ],
    energy_distribution: [
      {
        name: String,
        value: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PanelMetrics", PanelMetricsSchema);
