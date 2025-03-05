
import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.util.js";
import Test from "../models/test.model.js";
import Order from "../models/order.model.js";


  export const loginLabAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const labAdmin = await User.findOne({ email, role: "Lab Admin" });
      if (!labAdmin) {
        return res.status(404).json({ message: "Lab Admin not found" });
      }
  
       if (password) {
               const salt = await bcrypt.genSalt(10);
               labAdmin.password = await bcrypt.hash(password, salt);
             }
             
             const isPasswordCorrect = await bcrypt.compare(password.trim(), labAdmin.password);
             // console.log(" Password :",isPasswordCorrect);
             if (!isPasswordCorrect) {
               return res.status(401).json({ message: "Invalid email or password" });
             }

      // Generate a JWT token
      const token = generateToken(labAdmin); 

  
      res.status(200).json({
        success: true,
        message: "Login successful",
        labAdmin: {
          id: labAdmin._id,
          email: labAdmin.email,
          firstName: labAdmin.firstName,
          lastName: labAdmin.lastName,
          role: labAdmin.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in Lab Admin", error: error.message });
    }
  };
  export const logoutLabAdmin = (req, res) => {
    try {
      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging out Lab Admin", error: error.message });
    }
  };
  export const getLabAdminOverview = async (req, res) => {
    try {
      const labAdminId = req.user.id; 
  
      // Get total orders, pending orders, and completed orders
      const totalOrders = await Order.countDocuments({ labAdmin: labAdminId });
      const pendingOrders = await Order.countDocuments({ labAdmin: labAdminId, status: "pending" });
      const completedOrders = await Order.countDocuments({ labAdmin: labAdminId, status: "completed" });
  
      // Get total tests offered
      const totalTests = await Test.countDocuments({ labAdmin: labAdminId });
  
      res.status(200).json({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalTests,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };