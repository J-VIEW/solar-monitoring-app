const express = require("express");
const router = express.Router();
const {
  generatePerformanceReport,
  getUserReports,
  deleteReport,
} = require("../controllers/reportsController");
const authMiddleware = require("../middlewares/authMiddleware");

// Protect all routes
router.use(authMiddleware);

// Generate performance report
router.get("/generate", generatePerformanceReport);

// Get all reports for a user
router.get("/", getUserReports);

// Delete a report
router.delete("/:id", deleteReport);

module.exports = router;
