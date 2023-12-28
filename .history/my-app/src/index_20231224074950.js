import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { SnackbarProvider } from "notistack";

import App from "./App";

const root = document.getElementById("root");
const reactRoot = createRoot(root);

reactRoot.render(
  <BrowserRouter>
    <AuthProvider>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </AuthProvider>
  </BrowserRouter>
);
