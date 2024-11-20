const express = require("express");
const {
  getActiveAlerts,
  resolveAlert,
} = require("../controllers/alertsController");
const router = express.Router();

router.get("/", getActiveAlerts);
router.put("/:alert_id/resolve", resolveAlert);

module.exports = router;
