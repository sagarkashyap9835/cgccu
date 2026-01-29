import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
          alt="Room Interior"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6] scale-105"
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-blue-500 font-black tracking-[0.5em] uppercase text-xs mb-4">
            Trusted Since 2015
          </p>
          <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
            Find Your <span className="font-light text-gray-300">Perfect Room</span>
          </h1>
          <p className="text-gray-300 mt-6 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed italic">
            Comfortable • Affordable • Safe living spaces for Students & Professionals
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-4 border-2 border-gray-100 rounded-[3rem] group-hover:border-blue-600 transition-colors duration-500"></div>
            <img
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2070&auto=format&fit=crop"
              alt="Room Setup"
              className="relative w-full h-[500px] object-cover rounded-[2.5rem] shadow-2xl"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Our <span className="text-blue-600 italic">Mission</span>
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              Local area se shuru hua ye initiative aaj students aur working professionals ke liye ek trusted
              room & PG rental platform ban chuka hai.
            </p>

            <p className="text-gray-400 leading-relaxed italic">
              Humara goal simple hai — clean rooms, transparent pricing, aur ek safe living experience without
              broker hassle.
            </p>

            <div className="pt-6">
              <button className="border-b-2 border-black pb-2 text-xs font-black uppercase tracking-widest hover:text-blue-600 hover:border-blue-600 transition-all">
                Why Choose Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-center text-[10px] font-black tracking-[0.4em] uppercase text-blue-600 mb-2">
              What We Offer
            </h2>
            <h3 className="text-center text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Comfortable Living
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Fully Furnished Rooms",
                desc: "Bed, wardrobe, table & chair — ready to move in.",
                img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop",
              },
              {
                title: "Prime Locations",
                desc: "Near colleges, offices, markets & public transport.",
                img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
              },
              {
                title: "Affordable Pricing",
                desc: "No brokerage, no hidden charges — pay what you see.",
                img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop",
              },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="overflow-hidden rounded-3xl aspect-[4/5] mb-6 shadow-lg">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tighter mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="space-y-4">
            <h5 className="text-5xl font-black text-gray-100 italic">01</h5>
            <h6 className="text-lg font-black uppercase tracking-widest">Safety First</h6>
            <p className="text-gray-400 text-xs leading-loose font-medium px-4">
              Verified properties with secure surroundings.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="text-5xl font-black text-gray-100 italic">02</h5>
            <h6 className="text-lg font-black uppercase tracking-widest">Transparency</h6>
            <p className="text-gray-400 text-xs leading-loose font-medium px-4">
              Clear pricing, honest listings, zero brokerage.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="text-5xl font-black text-gray-100 italic">03</h5>
            <h6 className="text-lg font-black uppercase tracking-widest">Support</h6>
            <p className="text-gray-400 text-xs leading-loose font-medium px-4">
              Dedicated help before & after booking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gray-100">
        <div className="text-center px-6">
          <h2 className="text-2xl font-black uppercase tracking-[0.2em] mb-8">
            Book Your Room Today
          </h2>
          <button
            onClick={() => navigate("/findhome")}
            className="bg-black text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all duration-500 shadow-2xl active:scale-95"
          >
            View Available Rooms
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
