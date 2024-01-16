import { getStoredToken } from "../components/LocalStorageManager/LocalStorageManager";
import axiosInstance from "../components/axiosInstance";

export const validateToken = async () => {
  const token = getStoredToken();
  if (!token) {
    console.error("No token found");
    return false;
  }

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
