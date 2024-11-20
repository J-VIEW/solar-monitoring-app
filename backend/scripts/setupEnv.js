const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const generateEnvironmentFile = () => {
  const jwtSecret = crypto.randomBytes(32).toString("hex");

  const envContent = `# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/solar_monitor
# For MongoDB Atlas use:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/solar_monitor?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=${jwtSecret}

# Admin Configuration
ADMIN_EMAIL=admin@solarmonitor.com
ADMIN_PASSWORD=Admin@123456
ADMIN_PHONE=+1234567890

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Security Configuration
TOKEN_EXPIRY=24h
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
`;

  // Write to .env file
  fs.writeFileSync(path.join(process.cwd(), ".env"), envContent);

  console.log("\nEnvironment file (.env) has been created successfully!");
  console.log("\nImportant Notes:");
  console.log("1. Your JWT_SECRET has been generated automatically");
  console.log(
    "2. Update the MONGO_URI with your actual MongoDB connection string"
  );
  console.log("3. Change the admin credentials before deploying to production");
  console.log(
    "4. Update email configuration if you plan to use email features"
  );
  console.log("\nFor MongoDB Atlas:");
  console.log("1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)");
  console.log("2. Create or select your cluster");
  console.log('3. Click "Connect" and select "Connect your application"');
  console.log(
    "4. Copy the connection string and replace <username>, <password>, and <dbname>"
  );
  console.log("\nFor local MongoDB:");
  console.log("1. Ensure MongoDB is installed locally");
  console.log(
    "2. Use the default URI: mongodb://localhost:27017/solar_monitor"
  );
  console.log("\nTo verify your setup:");
  console.log("1. Run: npm run verify-env");
};

// Create a verification script
const verifyEnvironment = () => {
  try {
    require("dotenv").config();

    const requiredVars = [
      "NODE_ENV",
      "MONGO_URI",
      "JWT_SECRET",
      "ADMIN_EMAIL",
      "ADMIN_PASSWORD",
      "ADMIN_PHONE",
    ];

    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
      console.error("\nError: Missing required environment variables:");
      missing.forEach((varName) => console.error(`- ${varName}`));
      process.exit(1);
    }

    console.log("\nEnvironment verification successful!");
    console.log("All required variables are present.");
  } catch (error) {
    console.error("\nError verifying environment:", error);
    process.exit(1);
  }
};

// Execute based on command line argument
const command = process.argv[2];

if (command === "verify") {
  verifyEnvironment();
} else {
  generateEnvironmentFile();
}
