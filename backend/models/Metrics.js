const mongoose = require("mongoose");

const metricsSchema = new mongoose.Schema({
  device_id: { type: String, required: true },
  metrics: {
    dust: { type: Number, required: true },
    temperature: { type: Number, required: true },
    efficiency: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Metrics", metricsSchema);
