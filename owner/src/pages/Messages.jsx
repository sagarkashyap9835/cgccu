import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';

const Messages = () => {
    const { token, adminData, backendUrl } = useContext(AdminContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/message/owner-chats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setConversations(res.data.conversations);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchConversations();
            const interval = setInterval(fetchConversations, 10000);
            return () => clearInterval(interval);
        }
    }, [token]);

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!reply.trim() || !selectedConv) return;

        try {
            const res = await axios.post(`${backendUrl}/api/message/send`, {
                roomId: selectedConv.roomId,
                content: reply,
                type: "private",
                receiverId: selectedConv.otherPartyId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setReply("");
                fetchConversations();
                // Update selected conversation with the new message locally if possible, 
                // but re-fetching is safer.
            }
        } catch (error) {
            toast.error("Failed to send reply");
        }
    };

    // Update selected conversation whenever conversations list updates
    useEffect(() => {
        if (selectedConv) {
            const updated = conversations.find(c => c.otherPartyId === selectedConv.otherPartyId && c.roomId === selectedConv.roomId);
            if (updated) setSelectedConv(updated);
        }
    }, [conversations]);

    if (loading) return <div className="p-10 text-center">Loading messages...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
            {/* Conversations List */}
            <div className="w-full md:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-y-auto">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic text-blue-600">Inquiries</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chats from your listings</p>
                </div>
                <div>
                    {conversations.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-xs font-bold uppercase">No messages yet</div>
                    ) : (
                        conversations.map((conv, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedConv(conv)}
                                className={`p-4 border-b cursor-pointer transition-all hover:bg-blue-50 ${selectedConv?.otherPartyId === conv.otherPartyId ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-black uppercase text-gray-800">{conv.senderName || 'Anonymous'}</span>
                                    <span className="text-[8px] font-bold text-gray-400">{new Date(conv.lastTime).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 truncate font-medium">{conv.lastMessage}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                {selectedConv ? (
                    <>
                        {/* Header */}
                        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-black uppercase text-gray-900 tracking-widest">Chat with {selectedConv.senderName}</h3>
                                <p className="text-[8px] font-bold text-blue-600 uppercase">Room ID: {selectedConv.roomId}</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
                            {selectedConv.messages.map((msg, mIdx) => (
                                <div key={mIdx} className={`flex ${msg.senderId === adminData?._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-[13px] font-medium ${msg.senderId === adminData?._id
                                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.content}
                                        <span className="block text-[7px] mt-1 opacity-50 uppercase text-right">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleSendReply} className="p-4 bg-white border-t flex gap-2">
                            <input
                                type="text"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply here..."
                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            />
                            <button
                                type="submit"
                                className="bg-black text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all font-black uppercase text-[10px] tracking-widest"
                            >
                                Send Reply ➔
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col text-gray-400 p-10 text-center">
                        <div className="text-4xl mb-4">💬</div>
                        <p className="text-xs font-black uppercase tracking-[0.2em]">Select a conversation to reply</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
