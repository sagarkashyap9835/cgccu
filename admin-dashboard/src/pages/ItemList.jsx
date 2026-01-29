import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const RoomList = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/room/admin-all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setRooms(res.data.rooms);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  const handleSendOtp = async (id) => {
    if (!token) return alert("Please login as admin");
    try {
      const res = await axios.post(`${backendUrl}/api/room/send-otp/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchRooms();
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  }

  const handleVerify = async (id) => {
    if (!token) return alert("Please login as admin");
    try {
      const res = await axios.put(`${backendUrl}/api/room/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Property Verified Successfully ✅");
        fetchRooms();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!token) return alert("Please login as admin");
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${backendUrl}/api/room/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Room deleted successfully ✅");
      fetchRooms();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-4xl font-black text-center text-slate-900 mb-12 uppercase tracking-tighter italic">Property Verification Queue</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {rooms.length === 0 ? (
          <p className="col-span-full text-center text-gray-400 font-bold uppercase tracking-widest">No properties in queue.</p>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className={`bg-white rounded-2xl shadow-xl overflow-hidden border-4 ${room.verified ? 'border-green-500' : 'border-amber-400'} transition-all hover:scale-[1.02]`}>
              <div className="h-56 bg-gray-200 relative">
                <img src={room.images?.[0]} alt={room.title} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${room.verified ? 'bg-green-500 text-white' : 'bg-amber-400 text-amber-900'}`}>
                  {room.verified ? "VERIFIED" : "PENDING"}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-black text-xl text-slate-900 mb-4 line-clamp-1">{room.title}</h3>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 mb-6 text-sm">
                  <p className="font-bold text-slate-700 uppercase tracking-tight">Owner: <span className="font-normal">{room.ownerName}</span></p>
                  <p className="font-bold text-slate-700 uppercase tracking-tight">Aadhaar: <span className="font-normal">{room.aadhaarNumber}</span></p>
                  <p className="font-bold text-slate-700 uppercase tracking-tight">Phone: <span className="font-normal">{room.ownerPhone}</span></p>
                  {room.aadhaarImage && (
                    <a href={room.aadhaarImage} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-blue-600 font-bold underline hover:text-blue-800">Review ID Doc →</a>
                  )}
                  {room.isOtpVerified ? (
                    <div className="mt-2 text-[10px] font-black text-green-600 uppercase">Identity Verified ✅</div>
                  ) : (
                    <button
                      onClick={() => handleSendOtp(room._id)}
                      className="mt-3 w-full bg-amber-500 text-white py-2 rounded-lg font-black uppercase tracking-widest text-[9px] hover:bg-amber-600 transition-all"
                    >
                      🚀 Send Aadhaar OTP
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {!room.verified && (
                    <button
                      onClick={() => handleVerify(room._id)}
                      disabled={!room.isOtpVerified}
                      className={`flex-1 ${room.isOtpVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'} text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-md active:scale-95`}
                    >
                      Approve ✅
                    </button>
                  )}
                  <button onClick={() => handleDelete(room._id)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-md active:scale-95">Delete 🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList;
