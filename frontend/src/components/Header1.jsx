
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header1 = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      title: "Spacious Furnished Room",
      subtitle: "Perfect for Students & Working Professionals",
      price: "₹6,000 / month",
    },
    {
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      title: "Safe & Peaceful Living",
      subtitle: "24x7 Water • Power Backup • WiFi",
      price: "Near Market & Transport",
    },
    {
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      title: "Affordable Rental Property",
      subtitle: "Move-in Ready Rooms Available",
      price: "No Brokerage",
    },
  ];

  // Auto Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden bg-black mt-16">

      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt="Rental Property"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-20 text-left z-10">
        <h2 className="text-yellow-400 tracking-widest mb-3 font-semibold">
          PROPERTY FOR RENT
        </h2>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
          {slides[currentSlide].title}
        </h1>

        <p className="text-gray-200 text-lg md:text-2xl mb-2 max-w-xl">
          {slides[currentSlide].subtitle}
        </p>

        <p className="text-yellow-300 text-xl font-semibold mb-8">
          {slides[currentSlide].price}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/findhome")}
            className="bg-yellow-500 text-black font-bold px-8 py-4 rounded-full hover:bg-white transition-all"
          >
            View Rooms
          </button>

          <button
            onClick={() => navigate("/contact")}
            className="border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all"
          >
            Contact Owner
          </button>
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              index === currentSlide ? "w-10 bg-yellow-400" : "w-2 bg-white/50"
            }`}
          ></div>
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 10s linear infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default Header1;
