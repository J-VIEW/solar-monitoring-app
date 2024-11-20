// deviceController.js

// Add a new device
exports.addDevice = (req, res) => {
  const { name, location } = req.body;
  // Logic to save device (e.g., in a database)
  res
    .status(201)
    .json({ message: "Device added successfully", data: { name, location } });
};

// Get all devices
exports.getDevices = (req, res) => {
  // Logic to fetch devices from database
  const devices = [
    { id: 1, name: "Panel 1", location: "Nairobi" },
    { id: 2, name: "Panel 2", location: "Mombasa" },
  ];
  res.status(200).json(devices);
};
