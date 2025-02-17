import express from 'express';
import { getUserOrders, placeOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/place-order', placeOrder);
router.get('/order-result', getUserOrders);


export default router;