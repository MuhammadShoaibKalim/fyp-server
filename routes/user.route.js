import express from "express";
import { 
    userRegister, 
    userLogin, 
    userLogout, 
    getUserProfile, 
    updateUserProfile, 
    changePassword, 
    deleteUserAccount } from "../controllers/auth.controller.js";
import {
    getRecommendedTests,
    bookTestOrPackage,
    placeOrder,
    getUserOrders,
    getOrderDetails,
    cancelOrder
} from "../controllers/order.controller.js";
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


// User Services Routes
// router.post("/recommend-tests", isAuthenticated, getRecommendedTests); 
router.post("/book-test", isAuthenticated, bookTestOrPackage); 
router.post("/place-order", isAuthenticated, placeOrder); 
router.get("/orders", isAuthenticated, getUserOrders);
router.get("/order/:orderId", isAuthenticated, getOrderDetails); 
router.delete("/order/:orderId/cancel", isAuthenticated, cancelOrder); 

export default router;
