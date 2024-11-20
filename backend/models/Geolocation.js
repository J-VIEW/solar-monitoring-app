const mongoose = require("mongoose");

const GeolocationSchema = new mongoose.Schema({
  device_id: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

module.exports = mongoose.model("Geolocation", GeolocationSchema);
