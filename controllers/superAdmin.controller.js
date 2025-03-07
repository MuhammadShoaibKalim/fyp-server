import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.util.js";
import Lab from "../models/lab.model.js";
import Order from "../models/order.model.js";
  

// Create Super Admin
export const createSuperAdmin = async (req, res) => {
  try {
    // Check if a Super Admin already exists
    const superAdminExists = await User.findOne({ role: "Super Admin" });

    if (superAdminExists) {
      return res.status(403).json({ message: "Super Admin already exists. Access denied." });
    }

    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Super Admin",
    });

    res.status(201).json({
      success: true,
      message: "Super Admin created successfully",
      superAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating Super Admin", error: error.message });
  }
};

export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email, role: "Super Admin" });
    if (!user) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      superAdmin: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const logoutSuperAdmin = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};


// create superadmin and create lab admin
export const superAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLabs = await Lab.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      totalUsers,
      totalLabs,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching overview data", error: error.message });
  }
};
export const createLabAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "Super Admin") {
      return res.status(403).json({ message: "Access denied. Only Super Admin can create Lab Admins." });
    }

    const { email, password, firstName, lastName } = req.body;

    // Validate input fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the Lab Admin user
    const labAdmin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Lab Admin",
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: "Lab Admin created successfully",
      labAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating Lab Admin", error: error.message });
  }
};


// Get all inbox messages
export const getInbox = async (req, res) => {
  try {
    const inboxMessages = await Inbox.find().sort({ createdAt: -1 });
    res.status(200).json(inboxMessages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inbox messages", error: error.message });
  }
};

// Respond to inbox message
export const respondToInbox = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const updatedInbox = await Inbox.findByIdAndUpdate(
      id,
      { response, status: "Responded" },
      { new: true }
    );

    res.status(200).json({ message: "Inbox message responded successfully", inbox: updatedInbox });
  } catch (error) {
    res.status(500).json({ message: "Error responding to inbox message", error: error.message });
  }
};

//Get Super Admin settings
export const getSettings = async (req, res) => {
  try {
    const superAdmin = await User.findById(req.user.id).select("-password"); 
    if (!superAdmin) return res.status(404).json({ message: "Super Admin not found" });

    res.status(200).json(superAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error: error.message });
  }
};

// Update Super Admin settings (name, email, etc.)
export const updateSettings = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, email },
      { new: true }
    ).select("-password"); 

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};

// Change Super Admin Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const superAdmin = await User.findById(req.user.id);

    if (!superAdmin) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the entered current password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(currentPassword.trim(), superAdmin.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save the new password
    superAdmin.password = hashedPassword;
    await superAdmin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
};


