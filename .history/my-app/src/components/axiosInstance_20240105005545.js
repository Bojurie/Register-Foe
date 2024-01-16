import axios from "axios";

// Create an axios instance with base URL and headers
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Replace with your actual API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle specific response errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response handling (status code in the range of 2xx)
    return response;
  },
  (error) => {
    // Check if error is related to token expiration
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.error === "Token has expired"
    ) {
      // Logic to handle token refresh or redirect to login
      // Example: Redirect to login page
      // window.location = '/login';
    }
    // Forward any other error to be handled locally
    return Promise.reject(error);
  }
);

export default axiosInstance;
