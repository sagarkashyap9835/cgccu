import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Room from "../models/roomModel.js";

// 📝 Post a message to community or owner
export const sendMessage = async (req, res) => {
    try {
        const { roomId, content, type } = req.body;
        let { receiverId } = req.body;
        const senderId = req.user.id;

        let senderName = "User";

        if (senderId === 'super-admin') {
            senderName = "Admin";
        } else {
            const user = await User.findById(senderId);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });
            senderName = user.name;
        }

        // If it's a private chat and no receiverId provided, find it from the room
        if (type === "private" && !receiverId) {
            const room = await Room.findById(roomId);
            if (room) {
                receiverId = room.ownerId;
            }
        }

        const newMessage = await Message.create({
            senderId,
            senderName,
            roomId,
            content,
            type: type || "public",
            receiverId: receiverId || null,
        });

        res.json({ success: true, message: "Message sent", newMessage });
    } catch (error) {
        console.error("sendMessage Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📄 Get messages for a specific room (Community)
export const getRoomMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId, type: "public" }).sort({ createdAt: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📄 Get private chat between user and owner
export const getPrivateMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        // Get messages where current user is sender and someone is receiver, OR current user is receiver
        const messages = await Message.find({
            roomId,
            type: "private",
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 📄 Get all conversations for an owner (grouped by user and room)
export const getOwnerMessages = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Find all private messages where owner is either sender or receiver
        const allMessages = await Message.find({
            type: "private",
            $or: [{ senderId: ownerId }, { receiverId: ownerId }]
        }).sort({ createdAt: -1 });

        // Group by user and room to create unique conversations
        const conversations = {};
        allMessages.forEach(msg => {
            const otherPartyId = msg.senderId === ownerId ? msg.receiverId : msg.senderId;
            const key = `${otherPartyId}_${msg.roomId}`;

            if (!conversations[key]) {
                conversations[key] = {
                    lastMessage: msg.content,
                    lastTime: msg.createdAt,
                    senderName: msg.senderName, // This might need refinement to correctly label the other party
                    otherPartyId,
                    roomId: msg.roomId,
                    unread: msg.receiverId === ownerId && !msg.isRead, // Placeholder for unread status
                    messages: []
                };
            }
            conversations[key].messages.unshift(msg);
        });

        res.json({ success: true, conversations: Object.values(conversations) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
