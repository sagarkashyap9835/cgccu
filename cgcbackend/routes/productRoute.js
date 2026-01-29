
import express from "express";
import { addRoom, getRooms, updateRoom, deleteRoom, verifyRoom, getOwnerRooms, sendAadhaarOtp, verifyAadhaarOtp, getAllRoomsAdmin } from "../controllers/productController.js";
import { authOwner, authAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'aadhaarImage', maxCount: 1 }
]);

router.post("/add", authOwner, uploadFields, addRoom);
router.get("/all", getRooms);
router.get("/admin-all", authAdmin, getAllRoomsAdmin);
router.get("/owner-rooms", authOwner, getOwnerRooms);
router.put("/update/:id", authOwner, uploadFields, updateRoom);
router.delete("/delete/:id", authOwner, deleteRoom);

// Aadhaar OTP Routes
router.post("/send-otp/:id", authAdmin, sendAadhaarOtp);
router.post("/verify-otp/:id", authOwner, verifyAadhaarOtp);
router.get("/verify-otp/:id", verifyAadhaarOtp); // Public GET for browser testing (NO AUTH)

// New Verification Route (Admin Only)
router.put("/verify/:id", authAdmin, verifyRoom);

export default router;

