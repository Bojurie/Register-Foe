import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import App from "./App";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import App from "./App";

const root = document.getElementById("root");
const reactRoot = createRoot(root);

reactRoot.render(
  <BrowserRouter>
    <AuthProvider>
      {/* <App /> */}
      <App/>
    </AuthProvider>
  </BrowserRouter>
);
