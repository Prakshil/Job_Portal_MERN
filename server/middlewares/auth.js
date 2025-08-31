const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const auth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    console.log("[auth] Token from cookies:", token ? "present" : "missing");
    
    // If no cookie token, try Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log("[auth] Token from Authorization header:", token ? "present" : "missing");
      }
    }
    
    if (!token) {
      console.log("[auth] No token found in cookies or headers");
      return res.status(401).json({ error: "Unauthorized - No token" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    console.log("[auth] Decoded token:", { id: decoded.id, role: decoded.role });
    
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("[auth] User not found for ID:", decoded.id);
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    console.log("[auth] User authenticated:", { id: user._id, email: user.email, role: user.role });
    req.user = user;

    next();
  } catch (error) {
    console.log("[auth] Error:", error);
    res.status(500).json({ error: error.message });
  }
};
// export default auth;
module.exports = auth;
