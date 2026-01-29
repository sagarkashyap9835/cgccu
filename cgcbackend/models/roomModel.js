// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   image: { type: String },
// }, { timestamps: true });

// export default mongoose.model("Product", productSchema);


import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Room title
    description: { type: String },

    rent: { type: Number, required: true }, // Monthly rent

    bhkType: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "Single Room"],
      required: true,
    },

    beds: { type: Number, default: 1 },

    bathroomType: {
      type: String,
      enum: ["Attached", "Common"],
      required: true,
    },

    amenities: {
      wifi: { type: Boolean, default: false },
      furnished: { type: Boolean, default: false },
      fan: { type: Boolean, default: false },
      cooler: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      lightType: {
        type: String,
        enum: ["Bulb", "Mercury"],
        default: "Bulb",
      },
    },

    images: [{ type: String }], // Multiple images allowed

    availableRooms: { type: Number, default: 1 }, // spots left

    // Verification Details
    ownerName: { type: String, required: true },
    aadhaarNumber: { type: String, required: true }, // 12 digit validation in controller
    aadhaarImage: { type: String, required: true },
    verified: { type: Boolean, default: false },
    ownerId: { type: String, required: true },

    // Aadhaar OTP Verification
    ownerPhone: { type: String, required: true },
    verificationOtp: { type: String },
    isOtpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
