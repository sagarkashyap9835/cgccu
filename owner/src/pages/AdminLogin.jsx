import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const AdminLogin = () => {
  const { loginAdmin, registerOwner } = useContext(AdminContext);
  const [state, setState] = useState("Login"); // Login or Sign Up
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state === "Sign Up") {
      const success = await registerOwner(name, email, password);
      if (success) {
        navigate("/items");
      } else {
        alert("Registration failed. Please try again.");
      }
    } else {
      const success = await loginAdmin(email, password);
      if (success) {
        navigate("/items");
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-black text-center uppercase tracking-tighter italic">Owner {state}</h2>
        <p className="text-xs text-center text-gray-500 uppercase tracking-widest font-bold">Manage your property listings</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {state === "Sign Up" && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-black text-white w-full py-3 rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
          >
            {state === "Login" ? "Login" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          {state === "Login" ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-blue-600 cursor-pointer ml-1 font-bold"
            onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
          >
            {state === "Login" ? "Register here" : "Login here"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;
