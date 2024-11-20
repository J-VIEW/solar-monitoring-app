require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const verifySetup = async () => {
  console.log("\n🔍 Verifying System Setup...");

  // Check environment variables
  console.log("\n📋 Checking Environment Variables:");
  const requiredVars = [
    "NODE_ENV",
    "MONGO_URI",
    "JWT_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
  ];

  let allVarsPresent = true;
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.log(`❌ Missing: ${varName}`);
      allVarsPresent = false;
    } else {
      console.log(`✅ Found: ${varName}`);
    }
  });

  // Verify MongoDB connection
  console.log("\n📊 Testing Database Connection:");
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/solar_monitoring", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connection: Successful");
    await mongoose.disconnect();
  } catch (error) {
    console.log("❌ MongoDB Connection: Failed");
    console.error("Error:", error.message);
  }

  // Check file structure
  console.log("\n📁 Checking File Structure:");
  const requiredFiles = [
    ".env",
    "package.json",
    "backend/server.js",
    "src/App.js",
  ];

  requiredFiles.forEach((file) => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`✅ Found: ${file}`);
    } else {
      console.log(`❌ Missing: ${file}`);
    }
  });

  console.log("\n📝 Setup Verification Complete!");

  if (!allVarsPresent) {
    console.log("\n⚠️ Action Required: Some environment variables are missing");
    console.log("Run: npm run setup-env");
  }
};

verifySetup().catch(console.error);
