
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🟢 Place Order (COD)
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body; // items, amount, address from frontend

    const newOrder = new Order({
      userId: req.userId,
      items,
      amount,
      address, // Ensure model supports address if needed, or store in user. Ideally order should have address snapshot.
      status: "Pending",
      paymentMethod: "COD",
      deliveryStatus: "Pending"
    });
    await newOrder.save();

    // Clear user cart
    // await User.findByIdAndUpdate(req.userId, { cartData: [] }); // Optional: clear cart here

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Place Order Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🟢 Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    const options = {
      amount: totalPrice * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const newOrder = new Order({
      userId: req.userId,
      items,
      amount: totalPrice,
      razorpayOrderId: order.id,
      status: "Pending",
    });
    await newOrder.save();

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🟢 Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, userId: req.userId },
        { status: "Paid", razorpayPaymentId: razorpay_payment_id }
      );
      return res.json({ success: true, message: "Payment verified!" });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, userId: req.userId },
        { status: "Failed" }
      );
      return res.json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🟢 Get logged-in user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("items.productId", "name image price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 Cancel order by user
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId: req.userId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.deliveryStatus === "Delivered" || order.deliveryStatus === "Cancelled") {
      return res.status(400).json({ success: false, message: "Cannot cancel this order" });
    }

    order.deliveryStatus = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 Admin: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone address")
      .populate("items.productId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// 🟢 Admin: update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { deliveryStatus }, { new: true });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};





