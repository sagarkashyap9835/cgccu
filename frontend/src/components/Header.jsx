import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AppContext } from "../pages/Appcontext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { addToCart } = useContext(CartContext);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/room/all`);
        if (res.data.success) {
          const verifiedRooms = (res.data.rooms || []).filter(r => r.verified === true);
          setRooms(verifiedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [backendUrl]);


  return (
    <div className="p-4 sm:p-10 bg-[#fbfbfb] min-h-screen pt-12">
      {/* Header Section */}
      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
          Featured <span className="text-blue-600">Rooms</span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm md:text-base max-w-2xl mx-auto">
          Explore our latest listings directly on the home page.
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-4"></div>
      </div>

      {/* 🛍 Rooms Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {rooms.slice(0, 8).map((room, index) => (
            <RoomCard key={room._id} room={room} addToCart={addToCart} index={index} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 font-light">No rooms available right now ☹️</p>
        </div>
      )}

      <div className="text-center mt-16">
        <button
          onClick={() => navigate('/findhome')}
          className="px-8 py-3 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          View All Rooms
        </button>
      </div>

      <ToastContainer position="bottom-right" autoClose={2000} />

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const RoomCard = ({ room, addToCart, index, navigate }) => (
  <div
    className="group relative animate-card flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
  
    <div
      className="relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
      onClick={() => navigate(`/room/${room._id}`)}
    >
      <img
        src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
        alt={room.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 text-[10px] font-bold uppercase rounded-lg">
        {room.bhkType}
      </div>
      {room.verified && (
        <div className="absolute bottom-2 left-2 bg-green-500/90 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
          ✅ Verified
        </div>
      )}
    </div>

    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h2
          className="text-lg font-bold text-gray-900 leading-tight line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => navigate(`/room/${room._id}`)}
        >
          {room.title}
        </h2>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{room.description}</p>

      <div className="mt-auto grid grid-cols-2 items-center pt-3 border-t border-gray-100">
        <span className="text-xl font-black text-gray-900">₹{room.rent}<span className="text-[10px] font-normal text-gray-400">/mo</span></span>

        <button
          className="ml-auto bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              _id: room._id,
              name: room.title,
              price: room.rent,
              image: room.images?.[0]
            });
          }}
        >
          Add
        </button>
      </div>
    </div>
  </div>
);

export default Header;