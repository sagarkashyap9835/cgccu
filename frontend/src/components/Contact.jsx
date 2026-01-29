import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import contacthero from "../assets/contacthero.jpg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
  "http://localhost:5000/api/contact",
  formData
);

      if (res.data.success) {
        toast.success("Enquiry sent successfully 🏠");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Server error ");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <img
          src={contacthero}
          alt="Hostel Enquiry"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
        />
        <div className="relative text-center text-white">
          <p className="uppercase tracking-[0.3em] text-xs mb-3 text-green-400">
            Room & Hostel Support
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Room <span className="font-light text-gray-200">Enquiry</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-16">
        {/* Left Info */}
        <div className="lg:col-span-5 space-y-10">
          <h2 className="text-3xl font-bold">
            Visit Our <span className="text-green-600">Hostel</span>
          </h2>

          <p className="text-gray-600 leading-relaxed">
            For room availability, rent details, facilities or booking process,
            feel free to contact us. We are happy to assist students and parents.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="text-xl"></span>
              <p className="font-semibold">
                Barahi Bazar, Sitamarhi, Bihar
              </p>
            </div>

            <div className="flex gap-4 items-start">
              <span className="text-xl">📞</span>
              <p className="font-semibold">+91 9117400640</p>
            </div>

            <div className="flex gap-4 items-start">
              <span className="text-xl"></span>
              <p className="font-semibold">hostel.support@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-10 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold mb-8">
              Send Room Enquiry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-100 font-medium"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-100 font-medium"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-100 font-medium"
              />

              <textarea
                name="message"
                rows="5"
                placeholder="I am looking for a room / hostel near..."
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-4 rounded-xl bg-gray-100 font-medium resize-none"
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-green-700 transition"
              >
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
