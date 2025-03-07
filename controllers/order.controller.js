import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Test from "../models/test.model.js";
import Package from "../models/package.model.js";
import Payment from "../models/payment.model.js";


export const getRecommendedTests = async (req, res) => {
    try {
        const { symptoms } = req.body;

        // Validate input
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({ message: "Please provide symptoms as an array." });
        }

        // Find tests related to symptoms
        const recommendedTests = await Test.find({ symptoms: { $in: symptoms } });

        if (recommendedTests.length === 0) {
            return res.status(404).json({ message: "No tests found for the given symptoms." });
        }

        res.status(200).json({ success: true, recommendedTests });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const bookTestOrPackage = async (req, res) => {
    try {
        const { type, id } = req.body;
        if (!type || !id) {
            return res.status(400).json({ message: "Type and ID are required." });
        }

        let item;
        if (type === "test") {
            item = await Test.findById(id);
        } else if (type === "package") {
            item = await Package.findById(id).populate("tests");
        } else {
            return res.status(400).json({ message: "Invalid type. Must be 'test' or 'package'." });
        }

        if (!item) {
            return res.status(404).json({ message: `${type} not found.` });
        }

        res.status(200).json({ success: true, message: `${type} booked successfully.`, item });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const placeOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {
            type, id, paymentMethod, name, gender, age, phoneNumber, address, deliveryOption
        } = req.body;
        const userId = req.user.id;

        if (!type || !id || !paymentMethod || !name || !gender || !age || !phoneNumber || !address || !deliveryOption) {
            return res.status(400).json({ message: "All fields are required." });
        }

        let item, totalPrice;
        if (type === "test") {
            item = await Test.findById(id);
            totalPrice = item ? item.price : 0;
        } else if (type === "package") {
            item = await Package.findById(id).populate("tests");
            totalPrice = item ? item.tests.reduce((sum, test) => sum + test.price, 0) : 0;
        } else {
            return res.status(400).json({ message: "Invalid type. Must be 'test' or 'package'." });
        }

        if (!item) {
            return res.status(404).json({ message: `${type} not found.` });
        }

        const deliveryCharge = deliveryOption === "Home Delivery" ? 50 : 0;
        totalPrice += deliveryCharge;

        // Create payment record
        const payment = await Payment.create([{ userId, amountPaid: totalPrice, status: "Pending", method: paymentMethod }], { session });

        // Create order
        const order = await Order.create([{
            userId, type, itemId: id, name, gender, age, phoneNumber, address, deliveryOption,
            totalPrice, deliveryCharge, paymentStatus: "Pending", orderStatus: "Placed",
            paymentMethod, paymentId: payment[0]._id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, message: "Order placed successfully.", order: order[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate({
                path: "itemId",
                select: "name price tests",
                populate: { path: "tests", select: "name price" },
            })
            .populate("paymentId", "status amountPaid method refundedAt");

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate({
                path: "itemId",
                select: "name price tests",
                populate: { path: "tests", select: "name price" },
            })
            .populate("paymentId", "status amountPaid method refundedAt");

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("paymentId");

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.orderStatus !== "Placed") {
            return res.status(400).json({ message: "Only 'Placed' orders can be canceled." });
        }

        // Refund if payment exists and is completed
        if (order.paymentId && order.paymentId.status === "Completed") {
            order.paymentId.status = "Refunded";
            order.paymentId.refundedAt = new Date();
            await order.paymentId.save();
        }

        order.orderStatus = "Canceled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order canceled successfully, refund processed if applicable.",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
