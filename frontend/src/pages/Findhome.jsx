

import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AppContext } from "./Appcontext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Findhome = () => {
  const { addToCart } = useContext(CartContext);
  const { backendUrl, searchTerm } = useContext(AppContext);
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // 'lowToHigh', 'highToLow'

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/room/all`);
        if (res.data.success) {
          const verifiedRooms = (res.data.rooms || []).filter(r => r.verified === true);
          setRooms(verifiedRooms);
          setFilteredRooms(verifiedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [backendUrl]);

  useEffect(() => {
    let filtered = [...rooms];

    // Search Filter
    if (searchTerm) {
      filtered = filtered.filter((r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

  
    if (priceRange) {
      filtered = filtered.filter((r) => r.rent >= priceRange.min && r.rent <= priceRange.max);
    }

    if (sortOrder === "lowToHigh") filtered.sort((a, b) => a.rent - b.rent);
    else if (sortOrder === "highToLow") filtered.sort((a, b) => b.rent - a.rent);

    setFilteredRooms(filtered);
  }, [searchTerm, rooms, priceRange, sortOrder]);

  const ranges = [
    { label: "All", min: 0, max: Infinity },
    { label: "Under 2k", min: 0, max: 2000 },
    { label: "2k-5k", min: 2000, max: 5000 },
    { label: "5k+", min: 5000, max: 20000 },
  ];

  return (
    <div className="p-3 sm:p-10 bg-gray-50 min-h-screen pt-24 md:pt-32">
      
      <div className="max-w-7xl mx-auto mb-6 md:mb-12 px-2">
        <h1 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">
          Find Your <span className="text-blue-600">Dream Room</span>
        </h1>
        <p className="text-[10px] md:text-xs text-gray-400 mt-1 font-bold tracking-[0.2em]">COMFORT & LUXURY // 2026</p>
      </div>

    
      <div className="flex flex-wrap items-center gap-3 mb-8 px-2">
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {ranges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => setPriceRange(range.label === "All" ? null : { min: range.min, max: range.max })}
              className={`flex-shrink-0 px-5 py-2 text-[10px] md:text-xs font-black rounded-full border-2 transition-all duration-300 ${(priceRange?.min === range.min && range.label !== "All") || (range.label === "All" && !priceRange)
                ? "bg-black text-white border-black"
                : "bg-white text-gray-900 border-gray-200 hover:border-blue-400"
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>

      
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          className="ml-auto px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="">Sort By</option>
          <option value="lowToHigh">Rent: Low to High</option>
          <option value="highToLow">Rent: High to Low</option>
        </select>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredRooms.map((room, index) => (
            <RoomCard key={room._id} room={room} addToCart={addToCart} index={index} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No rooms match your criteria 🏠</p>
        </div>
      )}

      <ToastContainer position="bottom-center" autoClose={1500} hideProgressBar theme="dark" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// --- Responsive Room Card Component ---
const RoomCard = ({ room, addToCart, index, navigate }) => (
  <div
    className="group relative animate-fade-in-up flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    {/* Image Container */}
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

    {/* Content Area */}
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h2
          className="text-lg font-bold text-gray-900 leading-tight line-clamp-1 cursor-pointer hover:text-blue-600"
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

export default Findhome;