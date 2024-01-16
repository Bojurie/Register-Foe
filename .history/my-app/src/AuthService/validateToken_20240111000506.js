import axiosInstance from "../components/axiosInstance";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

export default validateToken = async (token) => {
  try {
    const response = await axiosInstance.get("/user/users/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.isValid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

