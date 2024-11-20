require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin exists
    const adminEmail = "vpleasant@kabarak.ac.ke";
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      // Update admin password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Adikapassword", salt);
      admin.password = hashedPassword;
      await admin.save();
      console.log("Admin password updated");
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Adikapassword", salt);

      admin = new User({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        phone: "+254112095930",
        role: "admin",
      });

      await admin.save();
      console.log("Admin user created successfully");
    }

    console.log("Admin details:", {
      email: admin.email,
      role: admin.role,
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmin();
