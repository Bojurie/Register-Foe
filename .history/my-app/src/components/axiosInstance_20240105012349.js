import axios from "axios";

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
  console.log("Token retrieved for request:", token); // Logging the token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Axios Request Headers with Token:", config.headers); // Logging headers
  }
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

export default axiosInstance;
