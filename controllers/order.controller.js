// Order Controller
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// Place Order
export const placeOrder = async(req, res) => {
    try {
        const {
            testId,
            name,
            gender,
            age,
            phoneNumber,
            address,
            deliveryOption,
        } = req.body;
        const user = User.findById(req.user.id);
        const userId = req.user.id;

        // Validate input
        if (!testId ||
            !name ||
            !gender ||
            !age ||
            !phoneNumber ||
            !address ||
            !deliveryOption
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate deliveryOption
        if (!["Lab Visit", "Home Delivery"].includes(deliveryOption)) {
            return res
                .status(400)
                .json({ message: "Invalid delivery option. Choose 'Lab Visit' or 'Home Delivery'." });
        }

        // Fetch test details from the database to calculate price
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        // Calculate subtotal and deliveryCharge
        const subtotal = test.price;
        const deliveryCharge = deliveryOption === "Home Delivery" ? 50 : 0;
        const totalPrice = subtotal + deliveryCharge;

        // Create a new order
        const order = new Order({
            userId,
            testId,
            name,
            gender,
            age,
            phoneNumber,
            address,
            deliveryOption,
            subtotal,
            deliveryCharge,
            totalPrice,
        });

        await order.save();
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};


// Get User Orders
export const getUserOrders = async(req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate("items.test items.package");

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};