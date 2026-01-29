import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const AdminLogin = () => {
  const { loginAdmin } = useContext(AdminContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginAdmin(email, password);
    if (success) {
      navigate("/items");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-black text-center uppercase tracking-tighter italic text-slate-900 underline decoration-blue-500">Super Admin</h2>
        <p className="text-xs text-center text-gray-500 uppercase tracking-widest font-bold">Verification Dashboard Login</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Admin Password"
            className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
