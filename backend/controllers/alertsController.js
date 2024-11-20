const Alert = require("../models/Alert");

// Fetch all active alerts
exports.getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: "active" }).sort({
      created_at: -1,
    });
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resolve an alert
exports.resolveAlert = async (req, res) => {
  const { alert_id } = req.params;

  try {
    const alert = await Alert.findById(alert_id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    alert.status = "resolved";
    alert.resolved_at = new Date();
    await alert.save();

    res.status(200).json({ message: "Alert resolved successfully", alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
