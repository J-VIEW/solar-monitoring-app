const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Function to generate a strong secret
const generateStrongSecret = () => {
  const secret = crypto.randomBytes(32).toString("hex");
  return secret;
};

// Function to check MongoDB connection
const checkMongoConnection = async () => {
  const mongoose = require("mongoose");
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/solar_monitoring", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connection Test: Successful");
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error("❌ MongoDB Connection Test: Failed");
    console.error("Error:", error.message);
    return false;
  }
};

// Main function to generate and save environment configuration
const generateEnvironmentConfig = async () => {
  console.log("\n🔐 Generating Security Configuration...");

  const jwtSecret = generateStrongSecret();
  const mongoConnection = await checkMongoConnection();

  const envConfig = `# Environment Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/solar_monitoring

# Security Configuration
JWT_SECRET=${jwtSecret}
TOKEN_EXPIRY=24h

# Admin Configuration
ADMIN_EMAIL=admin@solarmonitor.com
ADMIN_PASSWORD=Admin@${generateStrongSecret().substring(0, 8)}
ADMIN_PHONE=+1234567890

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Generated on: ${new Date().toISOString()}
`;

  // Save to .env file
  const envPath = path.join(process.cwd(), ".env");
  fs.writeFileSync(envPath, envConfig);

  console.log("\n📝 Environment Configuration Summary:");
  console.log("-----------------------------------");
  console.log("✅ JWT Secret: Generated (64 characters)");
  console.log(`✅ MongoDB URI: mongodb://127.0.0.1:27017/solar_monitoring`);
  console.log("✅ Environment: development");
  console.log(
    `✅ MongoDB Connection: ${mongoConnection ? "Successful" : "Failed"}`
  );

  console.log("\n⚠️ Important Next Steps:");
  console.log(
    "1. Keep your .env file secure and never commit it to version control"
  );
  console.log("2. Change the admin password after first login");
  console.log("3. Use different secrets for development and production");

  if (!mongoConnection) {
    console.log("\n❌ MongoDB Connection Issues:");
    console.log("1. Ensure MongoDB is running locally");
    console.log("2. Check if the port 27017 is available");
    console.log("3. Verify database name is correct");
  }
};

// Execute the configuration
generateEnvironmentConfig().catch(console.error);
