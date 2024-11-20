require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const debugAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = "vpleasant@kabarak.ac.ke";
    const plainPassword = "Adikapassword";

    // Clear existing admin
    await User.deleteOne({ email: adminEmail });
    console.log("Cleared existing admin user");

    // Create salt and hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create new admin
    const newAdmin = new User({
      name: "Victor Pleasant",
      email: adminEmail,
      password: hashedPassword,
      phone: "+254700000000",
      role: "admin",
      is_active: true,
    });

    await newAdmin.save();
    console.log("Admin saved to database");

    // Verify the saved admin
    const savedAdmin = await User.findOne({ email: adminEmail });
    console.log("Admin details:", {
      id: savedAdmin._id,
      email: savedAdmin.email,
      role: savedAdmin.role,
    });

    // Verify password
    const verifyPassword = await bcrypt.compare(
      plainPassword,
      savedAdmin.password
    );
    console.log("Password verification:", {
      plainPasswordProvided: plainPassword,
      hashMatch: verifyPassword,
    });

    if (!verifyPassword) {
      console.error("Password verification failed!");
    } else {
      console.log("Password verification successful!");
    }

    mongoose.connection.close();

    if (!verifyPassword) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

debugAdmin();
