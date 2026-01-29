import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Authenticate any user/owner/admin
export const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

// Specifically for Owner
export const authOwner = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if it's the super admin login (hardcoded)
        if (decoded.email === process.env.ADMIN_EMAIL) {
            req.user = decoded;
            return next();
        }

        // Check user role from DB if it's a normal token
        const user = await userModel.findById(decoded.id);
        if (user && (user.role === 'owner' || user.role === 'admin')) {
            req.user = decoded;
            next();
        } else {
            return res.status(403).json({ success: false, message: "Access denied. Owner role required." });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

// Specifically for Admin (Super Admin)
export const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hardcoded environmental check for super admin
        if (decoded.email === process.env.ADMIN_EMAIL) {
            req.admin = decoded;
            return next();
        }

        // Also allow if DB role is admin
        const user = await userModel.findById(decoded.id);
        if (user && user.role === 'admin') {
            req.admin = decoded;
            return next();
        }

        return res.status(403).json({ success: false, message: "Restricted to Super Admin" });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid Admin token" });
    }
};
