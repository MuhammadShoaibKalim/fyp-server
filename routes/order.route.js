import express from 'express';
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

router.post('/place-order', placeOrder);
router.get('/order-result', getUserOrders);



// User Services Routes
router.post("/recommend-tests", isAuthenticated, getRecommendedTests); 
router.post("/book-test", isAuthenticated, bookTestOrPackage); 
router.post("/place-order", isAuthenticated, placeOrder); 
router.get("/orders", isAuthenticated, getUserOrders);
router.get("/order/:orderId", isAuthenticated, getOrderDetails); 
router.delete("/order/:orderId/cancel", isAuthenticated, cancelOrder); 


export default router;