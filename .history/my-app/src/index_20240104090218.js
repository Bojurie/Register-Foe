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

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Base URL configuration for axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Replace with your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up request interceptor to attach the token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

// Axios response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
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
        // Handle token refresh logic here if needed
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Replace the global axios instance with the configured one
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
