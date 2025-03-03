
export const placeOrder = async (req, res) => {
    try {
      const { type, id } = req.body; // No paymentMethod here
  
      if (!type || !id) {
        return res.status(400).json({ message: "Type and ID are required." });
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
  
      // Create an order WITHOUT payment
      const order = await Order.create({
        userId: req.user.id,
        type,
        itemId: id,
        totalPrice,
        paymentStatus: "Pending",
        orderStatus: "Pending",
      });
  
      res.status(201).json({ success: true, message: "Order created. Proceed to payment.", order });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  //cash on ddelivery
  export const confirmCODPayment = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
  
      order.paymentStatus = "Completed";
      order.orderStatus = "Confirmed";
      await order.save();
  
      res.status(200).json({ success: true, message: "Order confirmed with Cash on Delivery." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  // payment online
  export const processOnlinePayment = async (req, res) => {
    try {
      const { orderId, method } = req.params;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
  
      // Generate a unique transaction ID (you can use a UUID library)
      const transactionId = `${orderId}-${Date.now()}`;
  
      // Redirect based on payment method
      let paymentUrl = "";
      if (method === "JazzCash") {
        paymentUrl = `https://jazzcash.com/pay?orderId=${orderId}&amount=${order.totalPrice}&transactionId=${transactionId}`;
      } else if (method === "EasyPaisa") {
        paymentUrl = `https://easypaisa.com/pay?orderId=${orderId}&amount=${order.totalPrice}&transactionId=${transactionId}`;
      } else if (method === "PayPal") {
        paymentUrl = `https://paypal.com/checkout?orderId=${orderId}&amount=${order.totalPrice}&transactionId=${transactionId}`;
      } else {
        return res.status(400).json({ message: "Invalid payment method." });
      }
  
      // Save transaction ID for reference
      order.paymentStatus = "Processing";
      order.transactionId = transactionId;
      await order.save();
  
      // Redirect user to the payment page
      res.redirect(paymentUrl);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  // success 
  export const handlePaymentSuccess = async (req, res) => {
    try {
      const { transactionId } = req.body;
  
      const order = await Order.findOne({ transactionId });
      if (!order) {
        return res.status(404).json({ message: "Transaction not found." });
      }
  
      // Update order status
      order.paymentStatus = "Completed";
      order.orderStatus = "Confirmed";
      await order.save();
  
      res.status(200).json({ success: true, message: "Payment successful. Order confirmed." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  //failure
  export const handlePaymentFailure = async (req, res) => {
    try {
      const { transactionId } = req.body;
  
      const order = await Order.findOne({ transactionId });
      if (!order) {
        return res.status(404).json({ message: "Transaction not found." });
      }
  
      // Update order status
      order.paymentStatus = "Failed";
      order.orderStatus = "Canceled";
      await order.save();
  
      res.status(200).json({ success: true, message: "Payment failed. Order canceled." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  