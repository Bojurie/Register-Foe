import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Provider  } from "react-redux";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import App from "./App";
import AuthProvider from "./components/AuthContext/AuthContext";
// import store from "./store";


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Axios Interceptor Setup
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.error === "Token has expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Your token refresh logic here
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

root.render(
  <React.StrictMode>
       <BrowserRouter>
        <AuthProvider>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
