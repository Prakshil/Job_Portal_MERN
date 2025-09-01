// Test script to verify logo path construction
console.log("Testing logo path construction...");

// Simulate API_URL (server base URL)
const API_URL = "http://localhost:3000";

// Simulate a company logo path as stored in the database
const companyLogo = "/uploads/logo-123456.jpg";

// Construct the full URL as done in the React components
const fullLogoUrl = `${API_URL}${companyLogo}`;

console.log("API_URL:", API_URL);
console.log("Company logo path:", companyLogo);
console.log("Full logo URL:", fullLogoUrl);

// This should output: http://localhost:3000/uploads/logo-123456.jpg
// Which is the correct path to access the static file served by Express
