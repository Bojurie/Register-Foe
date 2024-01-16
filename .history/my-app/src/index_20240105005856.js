import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import App from "./App";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import store from "./store";
import ErrorBoundary from "./components/ErrorBoundary";

import axiosInstance from "./components/axiosInstance"; // Import axiosInstance

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Use axiosInstance for all the axios calls throughout the app
axios.defaults = axiosInstance.defaults;

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <Provider store={store}>
          <ErrorBoundary>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ErrorBoundary>
        </Provider>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);