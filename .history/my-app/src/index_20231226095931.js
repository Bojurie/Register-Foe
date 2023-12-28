import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { SnackbarProvider } from "notistack";
import axios from "axios";
import App from "./App";
import { refreshTokenFunction } from "./components/AuthAPI/AuthAPI";
import { Provider } from "react-redux";
import store from "./store";


const root = document.getElementById("root");
const reactRoot = createRoot(root);

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
      originalRequest._retry = true; // Marking the request to avoid infinite loops

      try {
        const newToken = await refreshTokenFunction();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        // Handle errors, e.g., redirect to login if the refresh token is invalid
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
reactRoot.render(
  <BrowserRouter>
    <AuthProvider>
    
      <SnackbarProvider maxSnack={3}>
      <Provider store={store}>
         <App />
      </Provider>
       
      </SnackbarProvider>      
    </AuthProvider>
  </BrowserRouter>
);
