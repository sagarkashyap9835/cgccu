import { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [adminData, setAdminData] = useState(false);
  const backendUrl = "https://cgccu-1.onrender.com";

  const loadAdminProfileData = async () => {
    try {
      if (!token) return;
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAdminData(data.userData);
      }
    } catch (error) {
      console.log("Get Admin Profile Error:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminProfileData();
    } else {
      setAdminData(false);
    }
  }, [token]);

  const registerOwner = async (name, email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        email,
        password,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("adminToken", res.data.token);

        // After registration, make them an owner
        await axios.post(`${backendUrl}/api/user/become-owner`, {}, {
          headers: { Authorization: `Bearer ${res.data.token}` }
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Registration failed", err.response?.data || err.message);
      return false;
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("adminToken", res.data.token);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
      return false;
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/google-login`, {
        token: credential,
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("adminToken", res.data.token);
        // Automatically make them an owner if they log in through this panel
        await axios.post(`${backendUrl}/api/user/become-owner`, {}, {
          headers: { Authorization: `Bearer ${res.data.token}` }
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Google Login failed", err);
      return false;
    }
  };

  const logoutAdmin = () => {
    setToken("");
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider value={{ token, setToken, adminData, setAdminData, loginAdmin, registerOwner, loginWithGoogle, logoutAdmin, backendUrl }}>
      {children}
    </AdminContext.Provider>
  );
};
