import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import App from "./App";
import store from "./store";
import ErrorBoundary from "./components/ErrorBoundary";
import axiosInstance from "./components/axiosInstance"; // Import axiosInstance
import { AuthProvider } from "./components/AuthContext/AuthContext";


axios.defaults = axiosInstance.defaults;

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider maxSnack={3}>
          <Provider store={store}>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </Provider>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);