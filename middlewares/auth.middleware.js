import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "Unauthorized access: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded);

    if (!decoded || !decoded.id) {
      console.log("Invalid token payload");
      return res.status(401).json({ message: "Unauthorized access: Invalid token" });
    }

    // Find user by ID
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      console.log("User not found");
      return res.status(401).json({ message: "Unauthorized access: User not found" });
    }

    console.log("Authenticated user in middleware:", req.user);
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized access", error: error.message });
  }
};


export const isRole = (roles) => {
  return (req, res, next) => {
    // console.log("Checking role for user:", req.user); 
    if (!req.user) {
      console.log("User not found in request");
      return res.status(403).json({ message: "Access denied. User not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      console.log(`Access denied. User role: ${req.user.role}`);
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    // console.log("Role check passed");
    next();
  };
};


