import React from "react";
import logo from "../assets/logo1.jpg"; 
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* --- Upper Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">

          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 rounded-full border border-gray-800 object-cover"
              />
              <h2 className="text-xl font-black tracking-tighter uppercase italic">
                Room<span className="text-red-600">Rent</span>
              </h2>
            </div>

            <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs">
              Find verified rooms, flats & PGs near you. Trusted owners, 
              affordable rent, and hassle-free booking experience.
            </p>

            {/* Newsletter */}
            <div className="pt-4">
              <div className="flex border-b border-gray-800 pb-2 focus-within:border-red-600 transition-all">
                <input
                  type="email"
                  placeholder="Get Rent Alerts (Email)"
                  className="bg-transparent outline-none text-[10px] w-full font-bold tracking-widest uppercase placeholder:text-gray-700"
                />
                <button className="text-[10px] font-black uppercase tracking-tighter hover:text-red-600 transition">
                  Notify
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Explore
            </h3>
            <ul className="space-y-3 text-xs font-bold tracking-tight text-gray-500">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-white">Available Rooms</Link></li>
              <li><Link to="/add-room" className="hover:text-white">Post Property</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Support
            </h3>
            <ul className="space-y-3 text-xs font-bold tracking-tight text-gray-500">
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><span className="hover:text-white cursor-pointer">Tenant Guide</span></li>
              <li><span className="hover:text-white cursor-pointer">Owner Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">FAQs</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              Office
            </h3>
            <div className="space-y-4 text-xs font-bold text-gray-500 italic">
              <p className="not-italic leading-relaxed">
                Barahi Bazar, Riga, Sitamarhi,<br />
                Bihar, India - 843327
              </p>
              <p className="text-white hover:text-red-600 cursor-pointer">
                support@roomrent.com
              </p>
              <p className="text-lg text-white font-black not-italic">
                +91 9117400640
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Text */}
        <div className="hidden md:block py-4 border-t border-gray-900 overflow-hidden">
          <h1 className="text-[12vw] font-black text-white/5 uppercase tracking-tighter leading-none select-none whitespace-nowrap">
            Verified Rooms • Trusted Owners • Easy Living •
          </h1>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-900 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              © {new Date().getFullYear()} ROOM RENT. All rights reserved.
            </p>

            <div className="flex gap-8">
              {["Facebook", "Instagram", "WhatsApp", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-600 transition transform hover:-translate-y-1"
                >
                  {social}
                </a>
              ))}
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
              Built by <span className="text-white italic">SK</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
