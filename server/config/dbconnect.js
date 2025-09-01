/**
 * Database Connection Configuration
 * Establishes connection to MongoDB using Mongoose ODM
 * Handles connection errors and provides connection status
 */

const mongoose = require("mongoose");

/**
 * Connect to MongoDB Database
 * Uses environment variable for connection string
 * Configures connection options for optimal performance
 *
 * @returns {Promise<boolean>} Connection success status
 * @throws {Error} Connection failure with error details
 */
const connectDb = async () => {
  try {
    // Connect to MongoDB (deprecated options removed for Node.js Driver 4.0+)
    await mongoose.connect(process.env.MONGO_URL || process.env.MONGO_URI);

    // Log successful connection details
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Connected to database:", mongoose.connection.db.databaseName);
    console.log("🔗 Connection host:", mongoose.connection.host);
    console.log("📁 Available collections will be created as needed");

    return true;
  } catch (error) {
    // Log connection failure and rethrow for proper error handling
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDb;
