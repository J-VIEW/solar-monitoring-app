const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "client", "manager", "technician"],
    default: "client",
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  last_login: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Remove password from responses
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Verify password method
UserSchema.methods.verifyPassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password verification failed");
  }
};

module.exports = mongoose.model("User", UserSchema);
