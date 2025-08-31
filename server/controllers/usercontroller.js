/**
 * User Controller - Authentication & User Management
 * Handles user registration, login, logout, and profile operations
 * Uses bcrypt for password hashing and JWT for authentication
 */

const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * User Registration Controller
 * Creates a new user account with encrypted password
 * Sets JWT token in cookie for immediate authentication
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    console.log("[register] request body:", req.body);

    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !role) {
      console.log("[register] Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    console.log("[register] Checking if user exists with email:", email);
    const user = await User.findOne({ email });
    if (user) {
      console.log("[register] User already exists");
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password for security
    console.log("[register] Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    console.log("[register] Creating new user...");
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    // Save user to database
    console.log("[register] Saving user to database...");
    const savedUser = await newUser.save();
    console.log("[register] User saved successfully with ID:", savedUser._id);
    console.log("[register] Saved user data:", {
      id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role
    });

    // Verify user was saved correctly
    const verifyUser = await User.findById(savedUser._id);
    console.log("[register] Verification - User found in DB:", verifyUser ? "YES" : "NO");

    // Get total user count for debugging
    const userCount = await User.countDocuments();
    console.log("[register] Total users in database:", userCount);

    // Generate JWT token for authentication
    const token = await jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    // Set authentication cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      httpOnly: true, // Prevent XSS attacks
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax', // CSRF protection
      path: '/'
    });

    console.log("[register] token set in cookie for new user");

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * User Login Controller
 * Authenticates user credentials and returns JWT token
 * Supports role-based login (user/recruiter)
 */
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("[login] request body:", req.body);

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Debug: List all users for troubleshooting
    const allUsers = await User.find({}, { email: 1, role: 1 });
    console.log("[login] All users in database:", allUsers);

    // Find user by email
    const user = await User.findOne({ email });
    console.log("[login] Found user:", user ? user.email : "null");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Verify role matches
    if (role !== user.role) {
      return res.status(400).json({
        error: "Account doesn't exist with this role",
      });
    }

    // Generate JWT token
    const token = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    // Set authentication cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/'
    });

    console.log("[login] successful login for user:", user.email);
    console.log("[login] token set in cookie:", token ? "yes" : "no");

    // Return success response
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * User Logout Controller
 * Clears authentication cookie to log out user
 */
const logout = async (req, res) => {
  try {
    res.clearCookie("token", null);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * User Profile Controller
 * Returns user profile information (placeholder implementation)
 */
const profile = async (req, res) => {
  try {
    res.status(200).json({ message: "get profile success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Export all controller functions
module.exports = {
  register,
  login,
  profile,
  logout,
};
