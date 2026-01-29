// import Product from "../models/productModel.js";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config();
// import { authAdmin } from "../middlewares/authAdmin.js";
// // Add Product
// export const addProduct = async (req, res) => {
//   try {
//     const { name, description, price } = req.body;
//     if (!name || !price) return res.status(400).json({ success: false, message: "Name and price are required" });

//     let imageUrl = "";
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "electric-shop",
//       });
//       imageUrl = result.secure_url;
//     }

//     const product = new Product({ name, description, price, image: imageUrl });
//     await product.save();

//     res.json({ success: true, message: "Product added", product });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Get all products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json({ success: true, products });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Update product
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price } = req.body;

//     let updateData = { name, description, price };

//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "electric-shop",
//       });
//       updateData.image = result.secure_url;
//     }

//     const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
//     res.json({ success: true, message: "Product updated", product: updated });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Delete product
// export const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Product.findByIdAndDelete(id);
//     res.json({ success: true, message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Room from "../models/roomModel.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

// ➕ Add Room (Admin)
// ➕ Add Room (Admin/Owner)
export const addRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      bhkType,
      beds,
      bathroomType,
      wifi,
      furnished,
      fan,
      cooler,
      ac,
      lightType,
      availableRooms,
      ownerName,    // 🆕
      aadhaarNumber,// 🆕
      ownerPhone,   // 🆕
    } = req.body;

    if (!title || !rent || !bhkType || !ownerName || !aadhaarNumber || !ownerPhone) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    if (aadhaarNumber.length !== 12) {
      return res.status(400).json({ success: false, message: "Aadhaar number must be 12 digits" });
    }

    // Handle Room Images
    let uploadedImages = [];
    if (req.files['images']) {
      for (let file of req.files['images']) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "room-rent/rooms",
        });
        uploadedImages.push(result.secure_url);
      }
    }

    // Handle Aadhaar Image
    let aadhaarImageUrl = "";
    if (req.files['aadhaarImage'] && req.files['aadhaarImage'][0]) {
      const result = await cloudinary.uploader.upload(req.files['aadhaarImage'][0].path, {
        folder: "room-rent/aadhaar",
      });
      aadhaarImageUrl = result.secure_url;
    } else {
      return res.status(400).json({ success: false, message: "Aadhaar image is required" });
    }

    const room = await Room.create({
      title,
      description,
      rent,
      bhkType,
      beds,
      bathroomType,
      amenities: {
        wifi: wifi === 'true',
        furnished: furnished === 'true',
        fan: fan === 'true',
        cooler: cooler === 'true',
        ac: ac === 'true',
        lightType,
      },
      images: uploadedImages,
      availableRooms,
      ownerName,           // 🆕
      aadhaarNumber,       // 🆕
      ownerPhone,          // 🆕
      aadhaarImage: aadhaarImageUrl, // 🆕
      verified: false,     // 🆕 Default false
      ownerId: req.user.id || req.user.email, // Use id or email as fallback
    });

    res.json({ success: true, message: "Property submitted for verification", room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📲 Send Aadhaar OTP (Admin)
export const sendAadhaarOtp = async (req, res) => {
  try {
    const { id } = req.params;

    // --- TESTING MODIFICATION ---
    const otp = "111111";
    // ----------------------------

    const room = await Room.findByIdAndUpdate(id, { verificationOtp: otp }, { new: true });
    if (!room) return res.status(404).json({ success: false, message: "Property not found" });

    // Skip SMS if API Key is placeholder or missing
    if (!process.env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY === 'YOUR_FAST2SMS_API_KEY_HERE') {
      console.log(`[TEST MODE] OTP for ${room.ownerPhone}: ${otp}`);
      return res.json({
        success: true,
        message: "Testing Mode: Use OTP 111111 to verify property.",
        isTestMode: true
      });
    }

    // --- Actual SMS Logic using Fast2SMS (India) ---
    try {
      const cleanPhone = room.ownerPhone.replace(/\D/g, '').slice(-10);
      const smsResponse = await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${otp}&numbers=${cleanPhone}`);

      console.log("Fast2SMS Response:", smsResponse.data);
      res.json({ success: true, message: `OTP sent successfully to ${cleanPhone}` });
    } catch (smsError) {
      const errorData = smsError.response?.data;
      console.error("SMS Delivery Failed:", errorData || smsError.message);

      let detailedMessage = "OTP generated (API Key error, use 111111 for testing)";
      if (errorData?.status_code === 999) {
        detailedMessage = "Fast2SMS Error: Balance Low. Use 111111 for testing.";
      }

      console.log(`[DEV FALLBACK] OTP for ${room.ownerPhone}: ${otp}`);
      res.json({
        success: true,
        message: detailedMessage,
        devNote: "Use 111111 for testing while API is disconnected."
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ✅ Verify Aadhaar OTP (Owner)
export const verifyAadhaarOtp = async (req, res) => {
  try {
    const { id } = req.params;
    const otp = req.body.otp || req.query.otp; // Support body or query param for testing

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ success: false, message: "Property not found" });

    if (room.verificationOtp === otp) {
      room.isOtpVerified = true;
      room.verified = true; // 🚀 AUTOMATICALLY MAKE IT LIVE ON FRONTEND
      room.verificationOtp = ""; // Clear OTP
      await room.save();
      res.json({ success: true, message: "Aadhaar Identity Verified & Property is LIVE! ✅" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP. Please check again." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ✅ Verify Room (Admin)
export const verifyRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room.isOtpVerified) {
      return res.status(400).json({ success: false, message: "Owner identity must be verified via OTP first" });
    }

    room.verified = true;
    await room.save();
    res.json({ success: true, message: "Property Verified Successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get Owner's Rooms
export const getOwnerRooms = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user.email;
    const rooms = await Room.find({ ownerId });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📄 Get All Rooms (For Frontend - Only Verified)
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ verified: true });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🛡️ Get All Rooms (For Admin - Everything)
export const getAllRoomsAdmin = async (req, res) => {
  try {
    const rooms = await Room.find({}).sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update Room
// ✏️ Update Room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Handle Upload Fields (Object)
    if (req.files && req.files['images']) {
      let images = [];
      for (let file of req.files['images']) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "room-rent/rooms",
        });
        images.push(result.secure_url);
      }
      updateData.images = images;
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, message: "Room updated", room: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ❌ Delete Room
export const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

