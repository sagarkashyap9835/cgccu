

import validator from 'validator';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// GOOGLE AUTHENTICATION (Login/Register)
export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // 1. Google Token ko verify karein
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();

        // 2. Check karein ki user database mein hai ya nahi
        let user = await userModel.findOne({ email });

        if (!user) {

            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);

            user = new userModel({
                name,
                email,
                image: picture,
                password: randomPassword
            });
            await user.save();
        }

        // 3. JWT Token generate karein
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(200).json({
            success: true,
            token: jwtToken,
            message: "Google Login Successful"
        });

    } catch (error) {
        console.error("Google Auth Error:", error.message);
        res.status(500).json({ success: false, message: "Google Authentication failed" });
    }
};

// REGISTER USER (Manual)
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await new userModel({ name, email, password: hashedPassword }).save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({ success: true, token, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// LOGIN USER (Manual)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if it matches Super Admin from .env
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ id: 'super-admin', email }, process.env.JWT_SECRET, { expiresIn: '30d' });
            return res.status(200).json({ success: true, token, message: "Super Admin Login successful" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ success: true, token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET USER PROFILE
export const getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        if (userId === 'super-admin') {
            return res.json({
                success: true,
                userData: {
                    _id: 'super-admin',
                    name: 'Super Admin',
                    email: process.env.ADMIN_EMAIL,
                    role: 'admin'
                }
            });
        }

        const userData = await userModel.findById(userId).select("-password");
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let parsedAddress = userData.address;
        if (typeof parsedAddress === "string" && parsedAddress.trim() !== "") {
            try { parsedAddress = JSON.parse(parsedAddress); }
            catch (e) { parsedAddress = { line1: "", line2: "" }; }
        } else if (!parsedAddress || typeof parsedAddress !== "object") {
            parsedAddress = { line1: "", line2: "" };
        }

        res.json({ success: true, userData: { ...userData._doc, address: parsedAddress } });
    } catch (error) {
        console.error("getProfile Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data missing" });
        }

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        user.name = name;
        user.phone = phone;

        // Handle address safely
        if (typeof address === "string") {
            try {
                user.address = JSON.parse(address);
            } catch (e) {
                console.error("Address parse error:", e);
            }
        } else {
            user.address = address;
        }

        user.dob = dob;
        user.gender = gender;

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            user.image = imageUpload.secure_url;
        }

        await user.save();
        res.json({ success: true, message: "Profile updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// BECOME OWNER
export const becomeOwner = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId; // Priority to auth middleware
        if (!userId) return res.status(400).json({ success: false, message: "User ID required" });

        if (userId === 'super-admin') {
            return res.json({ success: true, message: "Super Admin access granted." });
        }

        const user = await userModel.findByIdAndUpdate(userId, { role: "owner" }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, message: "You are now an Owner! You can list properties.", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

