import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";

const AdminNavbar = () => {
  const { token, logoutAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white p-6 flex justify-between items-center px-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black italic">A</div>
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Admin <span className="text-blue-500">Board</span></h1>
      </div>

      {token ? (
        <div className="flex items-center gap-8">
          <Link to="/items" className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Verification Queue</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 border border-red-500/50 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            Logout
          </button>
        </div>
      ) : (
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Super Admin Authentication</span>
      )}
    </nav>
  );
};

export default AdminNavbar;
