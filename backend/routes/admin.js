const express = require("express");
const {
  createAdmin,
  getAdmins,
  updateAdmin,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin routes
router.post("/create", createAdmin);
router.get("/", getAdmins);
router.put("/:id", updateAdmin);

module.exports = router;
