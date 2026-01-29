import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AppcontextProvider from "./pages/Appcontext"; // ✅ default import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="80596191984-abkngvu8erm1cpg1oesj1kvkk44gfhr9.apps.googleusercontent.com">
    <AppcontextProvider>
      <BrowserRouter>
    <CartProvider>
        <App />
        </CartProvider>
        <ToastContainer position="top-right" autoClose={2000} />
      </BrowserRouter>
    </AppcontextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
