import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
    },
    phoneNumber: {
        type: String,
        match: [/^\d{10,15}$/, "Please provide a valid phone number"],
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    deliveryOption: {
        type: String,
        enum: ["Lab Visit", "Home Delivery"],
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Approved"],
        default: "Pending",
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0,
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    resultId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result",
        default: null,
    },
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);

export default Order;