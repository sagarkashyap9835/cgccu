

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const RoomList = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [rooms, setRooms] = useState([]);
  const [otpInputs, setOtpInputs] = useState({}); // Tracking OTP input for each room

  const fetchRooms = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/room/owner-rooms`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data.success) setRooms(res.data.rooms);
    } catch (err) {
      console.error("Failed to fetch owner rooms", err);
    }
  };

  const handleVerifyOtp = async (id) => {
    const otp = otpInputs[id];
    if (!otp) return toast.error("Please enter OTP");

    try {
      const res = await axios.post(`${backendUrl}/api/room/verify-otp/${id}`, { otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Aadhaar Verified Successfully ✅");
        fetchRooms();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  }

  const handleDelete = async (id) => {
    if (!token) return alert("Please login as admin");
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(
        `${backendUrl}/api/room/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Room deleted successfully ✅");
      fetchRooms();
    } catch (error) {
      console.log("Failed to delete room", error.response?.data || error.message);
    }
  };

  const handleVerify = async (id) => {
    if (!token) return alert("Please login as admin");
    if (!window.confirm("Verify this property and make it live?")) return;

    try {
      const res = await axios.put(`${backendUrl}/api/room/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Property Verified Successfully ✅");
        fetchRooms();
      }
    } catch (error) {
      toast.error("Verification failed ❌");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        My Properties
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rooms.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No rooms found.
          </p>
        ) : (
          rooms.map((room) => (
            <div
              key={room._id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${room.verified ? 'border-green-500' : 'border-yellow-400'}`}
            >
              {/* Image */}
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={room.images?.[0]}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${room.verified ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'}`}>
                  {room.verified ? "VERIFIED" : "PENDING VERIFICATION"}
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {room.title}
                </h3>
                {/* Owner Verification Info */}
                <div className="mt-3 bg-gray-50 p-2 rounded text-xs border border-gray-200">
                  <p className="font-semibold text-gray-700">Owner: {room.ownerName}</p>
                  <p className="text-gray-500">Aadhaar: {room.aadhaarNumber}</p>
                  <p className="text-gray-500">Phone: {room.ownerPhone}</p>
                  {room.aadhaarImage && (
                    <a href={room.aadhaarImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-1 block">View Aadhaar Card</a>
                  )}

                  {/* OTP Verification Section for Owner */}
                  {!room.isOtpVerified && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-[10px] font-bold text-amber-700 uppercase mb-2">Aadhaar OTP Verification</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="6-Digit OTP"
                          className="flex-1 px-2 py-1 rounded border text-xs outline-none focus:border-amber-500"
                          maxLength={6}
                          value={otpInputs[room._id] || ""}
                          onChange={(e) => setOtpInputs({ ...otpInputs, [room._id]: e.target.value })}
                        />
                        <button
                          onClick={() => handleVerifyOtp(room._id)}
                          className="bg-amber-500 text-white px-3 py-1 rounded text-[10px] font-bold hover:bg-amber-600 transition-all"
                        >
                          VERIFY
                        </button>
                      </div>
                      <p className="text-[9px] text-amber-600 mt-1 italic">*Admin needs to trigger OTP from their dashboard first.</p>
                    </div>
                  )}
                  {room.isOtpVerified && room.verified && (
                    <div className="mt-4 p-2 bg-green-50 text-green-700 text-[10px] font-bold text-center rounded border border-green-200 uppercase">
                      Verified & LIVE on Website ✅ <br />
                      <span className="text-[8px] font-normal lowercase">Owner identity confirmed via Aadhaar</span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>🏠 {room.bhkType}</p>
                  <p>💰 Rent: ₹{room.rent}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-xs"
                  >
                    Delete 🗑️
                  </button>
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
