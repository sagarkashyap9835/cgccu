import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        roomId: { type: String, required: true },
        content: { type: String, required: true },
        type: { type: String, enum: ["public", "private"], default: "public" }, // public for community, private for owner chat
        receiverId: { type: String }, // Only used for private owner chat
    },
    { timestamps: true }
);

const Message = mongoose.models.message || mongoose.model("message", messageSchema);
export default Message;
