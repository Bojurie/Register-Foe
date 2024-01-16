import { getStoredToken } from "../components/LocalStorageManager/LocalStorageManager";
import axiosInstance from "../components/axiosInstance";

const validateToken = async (token) => {
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

export default validateToken;
