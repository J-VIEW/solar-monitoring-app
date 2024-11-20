const express = require("express");
const router = express.Router();
const {
  registerUser,
  updateUser,
  getUsers,
  getClients, // New controller function for fetching clients
} = require("../controllers/userController");

// Route for user registration
router.post("/register", registerUser);

// Route for updating a user by ID
router.put("/:id", updateUser);

// Route for fetching all users or filtering by role
router.get("/", getUsers);

// New route specifically for fetching clients
router.get("/clients", getClients);

module.exports = router;
