import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

// Middleware to Authenticate User
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log()
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

// Role-based Access Control Middleware
export const isRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden: User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

// Middleware to Ensure Lab Admin Access
export const isLabAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Lab Admin") {
      return res.status(403).json({ message: "Access denied. Only Lab Admins allowed." });
    }

    // Ensure Lab Admin can only access their assigned lab
    const labAdminId = req.user._id.toString();
    if (req.params.labAdminId && req.params.labAdminId !== labAdminId) {
      return res.status(403).json({ message: "Forbidden: You can only access your own dashboard" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Middleware to Ensure Lab Admin Access
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token:",token)

      const decoded = jwt.verify(token, process.env.SUPERADMIN_SECRET_KEY);
      console.log("decode:",decoded)

      req.user = await User.findById(decoded.id).select("-password");
      console.log("user:",req.user )

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      if (req.user.role !== "Super Admin" && req.user.role !== "Lab Admin") {
        return res.status(403).json({ message: "Forbidden: Access Denied" });
      }

      next(); 
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};

// Check if user is a Super Admin
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "Super Admin") {
      return res.status(403).json({ message: "Access denied. Only Super Admins allowed." });
  }
  next();
};

