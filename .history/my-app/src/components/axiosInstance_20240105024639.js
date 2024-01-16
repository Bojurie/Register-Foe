import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
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
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       error.response.data.error === "Token has expired" &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       try {
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
  
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error handling logic here
    if (error.response && error.response.status === 401) {
      // Optional: Add logic for handling token expiration
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
