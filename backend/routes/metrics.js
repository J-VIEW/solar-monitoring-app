const express = require("express");
const router = express.Router();
const {
  getDashboardMetrics,
  saveMetrics,
  getHistoricalMetrics,
} = require("../controllers/metricsController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Protect all routes
router.use(authMiddleware);

// Get dashboard metrics
router.get("/dashboard", getDashboardMetrics);

// Get historical metrics
router.get("/historical", getHistoricalMetrics);

// Save metrics (restricted to certain roles)
router.post("/save", roleMiddleware(["admin", "technician"]), saveMetrics);

module.exports = router;
