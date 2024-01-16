import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Adding token to header"); // Debug log
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("Token expired or unauthorized"); // Debug log
        // Handle token expiration, e.g., redirect to login or refresh token
      }
      if (error.response.status === 500) {
        console.error("Server error occurred"); // Debug log
      }
    } else if (error.request) {
      console.error("No response received from the server"); // Debug log
    } else {
      console.error("Error setting up request:", error.message); // Debug log
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
