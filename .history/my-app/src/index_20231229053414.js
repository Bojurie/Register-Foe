import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import App from "./App";
import {AuthProvider} from "./components/AuthContext/AuthContext";
import store from "./store";
import ErrorBoundary from "./components/ErrorBoundary";


const rootElement = document.getElementById("root");
const root = createRoot(rootElement);


const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Replace with your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Use interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

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
