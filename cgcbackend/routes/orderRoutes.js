// import express from "express";
// import { createOrder, verifyPayment,getAllOrders } from "../controllers/orderController.js";
// import authUser from "../middlewares/authUser.js";
// import {authAdmin} from "../middlewares/authAdmin.js";
// const router = express.Router();

// router.post("/create", authUser, createOrder);
// router.post("/verify", authUser, verifyPayment);
// router.get("/admin/all", authAdmin, getAllOrders);
// export default router;


// routes/orderRoutes.js
// import express from "express";
// import { createOrder, verifyPayment, getAllOrders, getUserOrders, updateDeliveryStatus } from "../controllers/orderController.js";
// import authUser from "../middlewares/authUser.js";
// import { authAdmin } from "../middlewares/authAdmin.js";

// const router = express.Router();

// router.post("/create", authUser, createOrder);
// router.post("/verify", authUser, verifyPayment);
// router.get("/admin/all", authAdmin, getAllOrders);

// // ✅ New route for admin to update delivery
// router.put("/admin/:orderId/status", authAdmin, updateDeliveryStatus);
// router.get("/my-orders", authUser, getUserOrders);
// export default router;




import express from "express";
import {
  placeOrder,
  createOrder,
  verifyPayment,
  getAllOrders,
  getUserOrders,
  cancelOrder,
  updateDeliveryStatus,
} from "../controllers/orderController.js";
import authUser from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();

// User routes
router.post("/place", authUser, placeOrder);
router.post("/create", authUser, createOrder);
router.post("/verify", authUser, verifyPayment);
router.get("/my-orders", authUser, getUserOrders);
router.put("/cancel/:orderId", authUser, cancelOrder);

// Admin routes
router.get("/admin/all", authAdmin, getAllOrders);
router.put("/admin/:orderId/status", authAdmin, updateDeliveryStatus);

export default router;