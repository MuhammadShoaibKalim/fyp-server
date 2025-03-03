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
      role: "superAdmin",
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
    const user = await User.findOne({ email, role: "superAdmin" });
    if (!user) {
      return res.status(404).json({ message: "Super Admin not found" });
    }

     if (password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);
        }
        
        const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password);
        // console.log(" Password :",isPasswordCorrect);
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
    const { name, description, price } = req.body;
    const newCollection = await Collection.create({ name, description, price });
    res.status(201).json({ message: "Collection added successfully", collection: newCollection });
  } catch (error) {
    res.status(500).json({ message: "Error adding collection", error: error.message });
  }
};
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    );
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
    const inboxMessages = await Inbox.find();
    res.status(200).json(inboxMessages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inbox messages", error: error.message });
  }
};
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


//all pages controller 
// export const getPages = async (req, res) => {
//   try {
//     const pages = await Page.find();
//     res.status(200).json(pages);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching pages", error: error.message });
//   }
// };
// export const addPage = async (req, res) => {
//   try {
//     const { title, content, slug } = req.body;
//     const newPage = await Page.create({ title, content, slug });
//     res.status(201).json({ message: "Page added successfully", page: newPage });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding page", error: error.message });
//   }
// };
// export const updatePage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, slug } = req.body;
//     const updatedPage = await Page.findByIdAndUpdate(
//       id,
//       { title, content, slug },
//       { new: true }
//     );
//     res.status(200).json({ message: "Page updated successfully", page: updatedPage });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating page", error: error.message });
//   }
// };
// export const deletePage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Page.findByIdAndDelete(id);
//     res.status(200).json({ message: "Page deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting page", error: error.message });
//   }
// };



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
    const { siteName, supportEmail, maintenanceMode } = req.body;
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { siteName, supportEmail, maintenanceMode },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Settings updated successfully", settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};


