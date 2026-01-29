import { createContext, useState } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("superAdminToken") || "");
  const backendUrl = "https://cgccu-1.onrender.com";

  const loginAdmin = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("superAdminToken", res.data.token);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Admin Login failed", err.response?.data || err.message);
      return false;
    }
  };

  const logoutAdmin = () => {
    setToken("");
    localStorage.removeItem("superAdminToken");
  };

  return (
    <AdminContext.Provider value={{ token, loginAdmin, logoutAdmin, backendUrl }}>
      {children}
    </AdminContext.Provider>
  );
};
