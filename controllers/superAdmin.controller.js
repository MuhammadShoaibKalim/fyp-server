import User from "../models/user.model.js";
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
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email, role: "Super Admin" });
    if (!user) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

  
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      superAdmin: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
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


// controllers/overview/superAdmin.controller.js
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


// controllers/labs/superAdmin.controller.js
export const getLabs = async (req, res) => {
    try {
      const labs = await Lab.find();
      res.status(200).json(labs);
    } catch (error) {
      res.status(500).json({ message: "Error fetching labs", error: error.message });
    }
  };
  
  export const addLab = async (req, res) => {
    try {
      const { name, status } = req.body;
  
      const newLab = await Lab.create({
        name,
        status,
      });
  
      res.status(201).json({ message: "Lab created successfully", lab: newLab });
    } catch (error) {
      res.status(500).json({ message: "Error creating lab", error: error.message });
    }
  };
  
  export const updateLab = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
  
      const lab = await Lab.findByIdAndUpdate(id, { name, status }, { new: true });
      res.status(200).json({ message: "Lab updated successfully", lab });
    } catch (error) {
      res.status(500).json({ message: "Error updating lab", error: error.message });
    }
  };
  
  export const deleteLab = async (req, res) => {
    try {
      const { id } = req.params;
      await Lab.findByIdAndDelete(id);
      res.status(200).json({ message: "Lab deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting lab", error: error.message });
    }
  };


  // controllers/Users/superAdmin.controller.js
export const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
  };
  
  export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, role } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstName, lastName, email, role },
        { new: true }
      );
  
      res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error: error.message });
    }
  };
  
  export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  };



  // controllers/collections/superAdmin.controller.js
export const getCollections = async (req, res) => {
    try {
      const collections = await Collection.find();
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({ message: "Error fetching collections", error: error.message });
    }
  };
  
  export const addCollection = async (req, res) => {
    try {
      const { testTitle, status } = req.body;
  
      const newCollection = await Collection.create({
        testTitle,
        status,
      });
  
      res.status(201).json({ message: "Collection created successfully", collection: newCollection });
    } catch (error) {
      res.status(500).json({ message: "Error creating collection", error: error.message });
    }
  };
  
  export const updateCollection = async (req, res) => {
    try {
      const { id } = req.params;
      const { testTitle, status } = req.body;
  
      const updatedCollection = await Collection.findByIdAndUpdate(id, { testTitle, status }, { new: true });
      res.status(200).json({ message: "Collection updated successfully", collection: updatedCollection });
    } catch (error) {
      res.status(500).json({ message: "Error updating collection", error: error.message });
    }
  };
  
  export const deleteCollection = async (req, res) => {
    try {
      const { id } = req.params;
      await Collection.findByIdAndDelete(id);
      res.status(200).json({ message: "Collection deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting collection", error: error.message });
    }
  };



  
// controllers/inbox/superAdmin.controller.js
export const getInbox = async (req, res) => {
    try {
      const inboxItems = await Inbox.find();
      res.status(200).json(inboxItems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching inbox", error: error.message });
    }
  };
  export const deleteInboxItem = async (req, res) => {
    try {
      const { id } = req.params;
      await Inbox.findByIdAndDelete(id);
      res.status(200).json({ message: "Inbox item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting inbox item", error: error.message });
    }
  };


  // controllers/settings/superAdmin.controller.js
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error: error.message });
  }
};
export const updateSettings = async (req, res) => {
  try {
    const { profilePicture, password, ...otherSettings } = req.body;
    const updatedSettings = await Settings.findOneAndUpdate({}, { ...otherSettings }, { new: true });

    res.status(200).json({ message: "Settings updated successfully", settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};
