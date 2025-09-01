/**
 * Company Routes - API endpoints for company management
 * Handles company CRUD operations and logo uploads
 */

const express = require("express");
const multer = require("multer");
const path = require("path");

// Import controller functions
const {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
  uploadLogo,
  deleteCompany,
} = require("../controllers/companycontroller");

// Import authentication middleware
const auth = require("../middlewares/auth");

const router = express.Router();

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Uploads directory created:', uploadsDir);
}

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
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

// Company management routes
router.post("/register", auth, registerCompany); // Register new company
router.get("/get", auth, getCompany); // Get user's companies
router.get("/get/:id", getCompanyById); // Get company by ID

// Logo upload endpoint
router.post("/upload-logo/:id", auth, upload.fields([{ name: 'logo', maxCount: 1 }]), uploadLogo);

// Update company with logo support
router.put("/update/:id", auth, upload.fields([{ name: 'logo', maxCount: 1 }]), updateCompany);

// Delete company
router.delete("/delete/:id", auth, deleteCompany);

module.exports = router;
