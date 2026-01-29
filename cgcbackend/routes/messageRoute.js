import express from "express";
import { sendMessage, getRoomMessages, getPrivateMessages, getOwnerMessages } from "../controllers/messageController.js";
import { authUser } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", authUser, sendMessage);
router.get("/room/:roomId", getRoomMessages);
router.get("/private/:roomId", authUser, getPrivateMessages);
router.get("/owner-chats", authUser, getOwnerMessages);

export default router;
