import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        window.dispatchEvent(new CustomEvent("token-expired"));
      }

      // Additional error handling can be added here
      // For example, handling 500 Internal Server Error:
      if (error.response.status === 500) {
        // Handle server errors
      }
    } else if (error.request) {
      // Handle no response received from the server
    } else {
      // Handle other errors
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
