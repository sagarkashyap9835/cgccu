import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider, AdminContext } from "./context/AdminContext";
import { useContext } from "react";
import AdminNavbar from "./components/AdminNavbar";
import AdminLogin from "./pages/AdminLogin";
import ItemList from "./pages/ItemList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AdminContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AdminProvider>
      <Router>
        <AdminNavbar />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/items" element={<ProtectedRoute><ItemList /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <ToastContainer position="top-center" theme="dark" />
      </Router>
    </AdminProvider>
  );
}

export default App;
