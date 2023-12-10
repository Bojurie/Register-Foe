import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");
const reactRoot = createRoot(root);

reactRoot.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);