import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="80596191984-abkngvu8erm1cpg1oesj1kvkk44gfhr9.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
