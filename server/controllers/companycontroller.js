/**
 * Company Controller - Company Management & Logo Upload
 * Handles company CRUD operations and logo file uploads
 */

const Company = require("../models/companySchema");
const path = require("path");
const fs = require("fs");

/**
 * Register New Company
 * Creates a basic company entry with just the name
 */
const registerCompany = async (req, res) => {
  try {
    console.log("[registerCompany] User from auth middleware:", req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : "No user");
    console.log("[registerCompany] Request body:", req.body);

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Company name is required" });
    }

    console.log("[registerCompany] Checking if company name already exists:", name);
    const company = await Company.findOne({ name });
    if (company) {
      console.log("[registerCompany] Company already exists with name:", name);
      return res.status(400).json({ error: "Company already exists" });
    }

    console.log("[registerCompany] Creating new company...");
    const newCompany = new Company({
      name,
      userId: req.user._id  // Changed from req.user.id to req.user._id
    });

    console.log("[registerCompany] Saving company to database...");
    const savedCompany = await newCompany.save();

    console.log("[registerCompany] Company saved successfully with ID:", savedCompany._id);
    console.log("[registerCompany] Saved company data:", {
      id: savedCompany._id,
      name: savedCompany.name,
      userId: savedCompany.userId
    });
    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company: savedCompany,
    });
  } catch (error) {
    console.log("[registerCompany] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get Companies for User
 * Retrieves all companies owned by the authenticated user
 */
const getCompany = async (req, res) => {
  try {
    console.log("[getCompany] Getting companies for user:", req.user._id);
    const userId = req.user._id;  // Changed from req.user.id to req.user._id
    const companies = await Company.find({ userId });
    console.log("[getCompany] Found companies:", companies.length);
    console.log("[getCompany] Companies data:", companies);

    if (!companies || companies.length === 0) {
      console.log("[getCompany] No companies found for user");
      return res.status(200).json({
        success: true,
        message: "No companies found",
        company: []
      });
    }

    res.status(200).json({
      success: true,
      company: companies
    });
  } catch (error) {
    console.log("[getCompany] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get Company by ID
 * Retrieves a specific company by its ID
 */
const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update Company Details
 * Updates company information including logo
 */
const updateCompany = async (req, res) => {
  try {
    console.log("[updateCompany] User from auth middleware:", req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : "No user");
    console.log("[updateCompany] Request params:", req.params);
    console.log("[updateCompany] Request body:", req.body);
    console.log("[updateCompany] Request files:", req.files);

    const { name, description, website, location } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Company name is required" });
    }

    const updateData = { name, description, website, location };

    // Handle logo upload if file is provided
    if (req.files && req.files.logo) {
      const logoFile = req.files.logo[0];
      // Store the relative path to the logo
      updateData.logo = `/uploads/${logoFile.filename}`;
      console.log("[updateCompany] Logo uploaded:", logoFile.filename);
    }

    console.log("[updateCompany] Updating company with ID:", req.params.id);
    console.log("[updateCompany] Update data:", updateData);

    const companyupdate = await Company.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true }
    );

    if (!companyupdate) {
      console.log("[updateCompany] Company not found with ID:", req.params.id);
      return res.status(404).json({ error: "Company not found" });
    }

    console.log("[updateCompany] Company updated successfully:", companyupdate._id);
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: companyupdate,
    });
  } catch (error) {
    console.log("[updateCompany] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload Company Logo
 * Dedicated endpoint for logo upload (alternative to updateCompany)
 */
const uploadLogo = async (req, res) => {
  try {
    console.log("[uploadLogo] Request params:", req.params);
    console.log("[uploadLogo] Request files:", req.files);

    if (!req.files || !req.files.logo) {
      return res.status(400).json({ error: "No logo file provided" });
    }

    const logoFile = req.files.logo[0];
    const logoPath = `/uploads/${logoFile.filename}`;

    // Update company with new logo path
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { logo: logoPath },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: "Company not found or access denied" });
    }

    console.log("[uploadLogo] Logo uploaded successfully for company:", company._id);
    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      logo: logoPath,
      company: company
    });
  } catch (error) {
    console.log("[uploadLogo] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete Company
 * Removes a company and its associated logo file
 */
const deleteCompany = async (req, res) => {
  try {
    console.log("[deleteCompany] User from auth middleware:", req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : "No user");
    console.log("[deleteCompany] Company ID to delete:", req.params.id);

    // Find company first to get logo path for deletion
    const company = await Company.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found or you don't have permission to delete it" });
    }

    // Delete logo file if it exists
    if (company.logo) {
      const logoPath = path.join(__dirname, "../", company.logo);
      try {
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
          console.log("[deleteCompany] Logo file deleted:", logoPath);
        }
      } catch (fileError) {
        console.log("[deleteCompany] Error deleting logo file:", fileError);
        // Don't fail the operation if file deletion fails
      }
    }

    // Delete company from database
    const deletedCompany = await Company.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    console.log("[deleteCompany] Company deleted successfully:", deletedCompany._id);
    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      deletedCompany
    });
  } catch (error) {
    console.log("[deleteCompany] Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
  uploadLogo,
  deleteCompany,
};
