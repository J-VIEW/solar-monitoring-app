const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Helper function to sanitize user object (remove sensitive data)
const sanitizeUser = (user) => {
  const sanitized = user.toObject();
  delete sanitized.password;
  return sanitized;
};

// Controller for registering a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Ensure role is valid and not admin (admin creation should be separate)
    if (role && !["client", "technician", "manager"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "client",
      phone,
      created_at: new Date(),
      is_active: true,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error registering user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller for updating a user's details
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, email, ...updatedData } = req.body;

    // Prevent role and email updates through this endpoint
    if (role) {
      return res
        .status(400)
        .json({ message: "Role cannot be updated through this endpoint" });
    }

    // Find user first to check if exists and get current role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent updating admin users
    if (user.role === "admin") {
      return res
        .status(403)
        .json({
          message: "Admin users cannot be modified through this endpoint",
        });
    }

    // If password is being updated, hash it
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updatedData, updated_at: new Date() },
      {
        new: true,
        runValidators: true,
        select: "-password",
      }
    );

    res.json({
      message: "User updated successfully",
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Error updating user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller for fetching all users (excluding admins)
const getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    // Base query excluding admin users
    let query = { role: { $ne: "admin" } };

    // Add role filter if provided
    if (role && ["client", "technician", "manager"].includes(role)) {
      query.role = role;
    }

    // Add status filter if provided
    if (status === "active" || status === "inactive") {
      query.is_active = status === "active";
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password -__v")
      .sort({ created_at: -1 });

    res.json(users);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller for fetching only clients
const getClients = async (req, res) => {
  try {
    const clients = await User.find({
      role: "client",
      is_active: true,
    })
      .select("-password -__v")
      .sort({ created_at: -1 });

    res.json(clients);
  } catch (error) {
    console.error("Fetch clients error:", error);
    res.status(500).json({
      message: "Error fetching clients",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller for updating user status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Find user first to check role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent updating admin status
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin status cannot be modified" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        is_active,
        updated_at: new Date(),
      },
      {
        new: true,
        runValidators: true,
        select: "-password",
      }
    );

    res.json({
      message: "User status updated successfully",
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({
      message: "Error updating user status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Controller for deleting a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user first to check role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting admin users
    if (user.role === "admin") {
      return res
        .status(403)
        .json({
          message: "Admin users cannot be deleted through this endpoint",
        });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Error deleting user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  registerUser,
  updateUser,
  getUsers,
  getClients,
  updateUserStatus,
  deleteUser,
};
