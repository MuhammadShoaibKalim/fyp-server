import express from "express";
import {
  placeOrder,
  confirmCODPayment,
  processOnlinePayment,
  handlePaymentSuccess,
  handlePaymentFailure,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/place-order", placeOrder);
router.post("/confirm-cod/:orderId", confirmCODPayment);
router.get("/pay/:orderId/:method", processOnlinePayment);
router.post("/payment-success", handlePaymentSuccess);
router.post("/payment-failure", handlePaymentFailure);

export default router;
