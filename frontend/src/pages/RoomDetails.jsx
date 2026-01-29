import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "./Appcontext";
import { CartContext } from "../context/CartContext";
import { FaBed, FaBath, FaWifi, FaFan, FaSnowflake, FaLightbulb, FaCouch, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { backendUrl, token, userData } = useContext(AppContext);
    const { addToCart } = useContext(CartContext);

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [privateMessages, setPrivateMessages] = useState([]);
    const [newPrivateMessage, setNewPrivateMessage] = useState("");

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/message/room/${id}`);
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const fetchPrivateMessages = async () => {
        if (!token || !showChatModal) return;
        try {
            const res = await axios.get(`${backendUrl}/api/message/private/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setPrivateMessages(res.data.messages);
            }
        } catch (error) {
            console.error("Error fetching private messages:", error);
        }
    };

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/room/all`);
                if (res.data.success) {
                    const foundRoom = res.data.rooms.find((r) => r._id === id);
                    if (foundRoom) {
                        setRoom(foundRoom);
                        setMainImage(foundRoom.images[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching room details:", error);
                toast.error("Failed to load room details");
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
        fetchMessages();

        // Optional: Poll for new messages every 10 seconds for community feel
        const interval = setInterval(() => {
            fetchMessages();
            fetchPrivateMessages();
        }, 10000);
        return () => clearInterval(interval);
    }, [backendUrl, id, token, showChatModal]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!token) return toast.warning("Please login to post in community");
        if (!newMessage.trim()) return;

        setIsSending(true);
        try {
            const res = await axios.post(`${backendUrl}/api/message/send`, {
                roomId: id,
                content: newMessage,
                type: "public"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setNewMessage("");
                fetchMessages();
                toast.success("Comment posted!");
            }
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    const handleSendPrivateMessage = async (e) => {
        e.preventDefault();
        if (!token) return toast.warning("Please login to chat with owner");
        if (!newPrivateMessage.trim()) return;

        try {
            const res = await axios.post(`${backendUrl}/api/message/send`, {
                roomId: id,
                content: newPrivateMessage,
                type: "private",
                receiverId: room.ownerId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setNewPrivateMessage("");
                fetchPrivateMessages();
                toast.success("Message sent to owner!");
            } else {
                toast.error(res.data.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Chat error:", error);
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!room) return <div className="text-center pt-20 text-2xl">Room not found 😕</div>;

    const handleAddToCart = () => {
        addToCart({
            _id: room._id,
            name: room.title,
            price: room.rent,
            image: room.images[0],
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-10 pb-10">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 mb-6 hover:text-black transition-colors"
            >
                <FaArrowLeft /> Back to listings
            </button>

            <div className="max-w-7xl mx-auto space-y-10">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">

                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative group">
                            <img
                                src={mainImage}
                                alt={room.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {room.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-blue-600 scale-95' : 'border-transparent hover:border-blue-300'
                                        }`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                                {room.title}
                            </h1>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                {room.availableRooms > 0 ? "Available" : "Sold Out"}
                            </span>
                        </div>

                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">₹{room.rent}</span>
                            <span className="text-sm text-gray-500 font-medium">/ month</span>
                        </div>

                        <p className="mt-6 text-gray-600 leading-relaxed text-sm lg:text-base">
                            {room.description}
                        </p>

                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <FeatureIcon icon={<FaBed />} label={`${room.beds} Beds`} />
                            <FeatureIcon icon={<FaBath />} label={room.bathroomType} />
                            <FeatureIcon icon={<span className="font-bold text-xs border rounded px-1">{room.bhkType}</span>} label="Type" />
                        </div>

                        {/* Amenities */}
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Amenities</h3>
                            <div className="flex flex-wrap gap-3">
                                {room.amenities.wifi && <AmenityBadge icon={<FaWifi />} label="Wi-Fi" />}
                                {room.amenities.furnished && <AmenityBadge icon={<FaCouch />} label="Furnished" />}
                                {room.amenities.ac && <AmenityBadge icon={<FaSnowflake />} label="AC" />}
                                {room.amenities.fan && <AmenityBadge icon={<FaFan />} label="Fan" />}
                                <AmenityBadge icon={<FaLightbulb />} label={room.amenities.lightType} />
                            </div>
                        </div>

                        {/* Owner Info Hook */}
                        <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Managed By</p>
                                <p className="text-sm font-bold text-gray-800">{room.ownerName}</p>
                            </div>
                            <button
                                onClick={() => setShowChatModal(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-100"
                            >
                                Chat with Owner
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-10 flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => {
                                    handleAddToCart();
                                    navigate('/cart');
                                }}
                                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Private Chat Modal --- */}
                {showChatModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
                            {/* Header */}
                            <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">Chat with Owner</h3>
                                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{room.ownerName}</p>
                                </div>
                                <button onClick={() => setShowChatModal(false)} className="text-2xl font-light hover:rotate-90 transition-transform">✕</button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                                {privateMessages.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No messages yet. Say hello!</p>
                                    </div>
                                ) : (
                                    privateMessages.map((msg) => (
                                        <div key={msg._id} className={`flex ${msg.senderId === userData?._id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${msg.senderId === userData?._id
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                                <span className="block text-[8px] mt-1 opacity-50 text-right uppercase font-bold">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendPrivateMessage} className="p-4 bg-white border-t flex gap-2">
                                <input
                                    type="text"
                                    value={newPrivateMessage}
                                    onChange={(e) => setNewPrivateMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-blue-700 transition"
                                >
                                    ➔
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Community Discussion Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
                            💬
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Community Discussion</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chat with other tenants & neighbors</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Message Feed */}
                        <div className="lg:col-span-2 space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                            {messages.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No messages yet. Be the first to ask about this room!</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg._id} className="group relative bg-gray-50 p-5 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{msg.senderName}</span>
                                            <span className="text-[9px] font-bold text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">{msg.content}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Post Message Form */}
                        <div className="bg-black text-white p-8 rounded-3xl shadow-2xl h-fit">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6">Ask/Discuss Hub</h3>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Is the water supply good? How's the owner?"
                                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm outline-none focus:border-blue-600 transition-colors h-32 resize-none text-white placeholder:text-gray-700 font-medium"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSending ? "Posting..." : "Post Message ➔"}
                                </button>
                                {!token && (
                                    <p className="text-[10px] text-gray-500 text-center font-bold uppercase tracking-tighter">Login required to participate</p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
        </div>
    );
};

// Helper Components
const FeatureIcon = ({ icon, label }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="text-blue-600 text-lg">{icon}</div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
);

const AmenityBadge = ({ icon, label }) => (
    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
        {icon} {label}
    </span>
);

export default RoomDetails;
