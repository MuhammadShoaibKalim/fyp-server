
import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.util.js";
import Test from "../models/test.model.js";
import Order from "../models/order.model.js";
import Lab from "../models/lab.model.js";
import mongoose from "mongoose";

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
      const labAdminId = req.user?.id; // Ensure it exists
    console.log("Lab Admin ID:", labAdminId); // Debugging log

      const totalOrders = await Order.countDocuments({ labAdmin: labAdminId });
      const pendingOrders = await Order.countDocuments({ labAdmin: labAdminId, status: "pending" });
      const completedOrders = await Order.countDocuments({ labAdmin: labAdminId, status: "completed" });
     
      const totalTests = await Test.countDocuments({ lab: new mongoose.Types.ObjectId(labAdminId) });
      
    



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
 
  
  //getLabAdminProfile
  export const getLabAdminProfile = async (req, res) => {
    try {
      const labAdminId = req.user.id;
      const labAdmin = await User.findById(labAdminId);
  
      if (!labAdmin) {
        return res.status(404).json({ message: "Lab Admin not found" });
      }
  
      res.status(200).json(labAdmin);
    } catch (error) {
      res.status(500).json({ message: "Error fetching Lab Admin", error: error.message });
    }
   
  };
  export const updateLabAdminProfile = async (req, res) => {
    try {
      const labAdminId = req.user.id;
      let updates = req.body;
  
      // Check if password is being updated
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }
  
      const updatedLabAdmin = await User.findByIdAndUpdate(labAdminId, updates, { new: true });
  
      res.status(200).json({ message: "Profile updated", labAdmin: updatedLabAdmin });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error: error.message });
    }
  };
  export const updateLabDetails = async (req, res) => {
    try {
      const labAdminId = req.user.id;
      const updatedLab = await Lab.findOneAndUpdate({ labAdmin: labAdminId }, req.body, { new: true });
  
      res.status(200).json({ message: "Lab details updated", lab: updatedLab });
    } catch (error) {
      res.status(500).json({ message: "Error updating lab details", error: error.message });
    }
  };
  export const getInboxMessages = async (req, res) => {
    const inboxMessages = await Inbox.find({ labAdmin: req.user.id });
    res.status(200).json(inboxMessages);
  };
  export const respondToInboxMessage = async (req, res) => {
    const { id } = req.params;
    const { response } = req.body;
  
    const updatedInbox = await Inbox.findByIdAndUpdate(id, { response, status: "Responded" }, { new: true });
    res.status(200).json({ message: "Message responded successfully", inbox: updatedInbox });
  };
  
