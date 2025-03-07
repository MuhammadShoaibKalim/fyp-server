import express from "express";
import { 
    userRegister, 
    userLogin, 
    userLogout, 
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    deleteUserAccount } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";  
const router = express.Router();

//  Public Routes
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/logout", userLogout);

// Protected Routes (Require Authentication)
router.get("/profile", isAuthenticated, getUserProfile);
router.put("/:id", isAuthenticated, updateUserProfile);
router.put("/change-password", isAuthenticated, changePassword);
router.delete("/:id", isAuthenticated, deleteUserAccount);



export default router;
