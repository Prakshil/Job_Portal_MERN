/**
 * Main Server Entry Point
 * Job Portal Backend API Server
 * Handles all API routes, middleware, and database connections
 */

require("dotenv").config({ quiet: true });
const express = require("express");
const path = require("path");
const app = express();

// Import route handlers
const userRoute = require("../routes/userRoute");
const jobRoute = require("../routes/jobRoute");
const companyRoute = require("../routes/companyRoute");
const applicationRoute = require("../routes/applicationRoute");

// Import database connection
const db = require("../config/dbconnect");

// Import middleware
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure CORS for cross-origin requests
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://devconnects-p0bl.onrender.com"
    ], // Frontend URLs
    credentials: true, // Allow cookies and authentication headers
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Parse cookies from requests
app.use(cookieParser());

// Mount API routes
app.use("/api/user", userRoute); // User authentication and profile routes
app.use("/api/job", jobRoute); // Job posting and retrieval routes
app.use("/api/company", companyRoute); // Company management routes
app.use("/api/application", applicationRoute); // Job application routes

// Basic health check endpoint
app.get("/", (req, res) => {
  res.send("Job Portal API Server is running");
});

// Server configuration
const PORT = process.env.PORT || 3000;
const HOSTNAME = "0.0.0.0";

// Connect to database and start server
db()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, HOSTNAME, () => {
      console.log(`🚀 Server running on http://${HOSTNAME}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
