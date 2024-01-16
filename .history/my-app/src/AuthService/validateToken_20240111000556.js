import axiosInstance from "../components/axiosInstance";
// import {
//   getStoredUser,
//   setStoredUser,
//   removeStoredUser,
//   removeStoredToken,
//   setStoredToken,
//   getStoredToken,
// } from "../LocalStorageManager/LocalStorageManager";

const validateToken = async () => {
  const token = localStorage.getItem("token"); // Get the token from localStorage
  if (!token) {
    console.error("No token found");
    return false;
  }

  try {
    // Send a GET request with the Authorization header
    const response = await axiosInstance.get("/user/users/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.isValid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

export default validateToken;
