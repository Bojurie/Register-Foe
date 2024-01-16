import axiosInstance from "../components/axiosInstance";

export const validateToken = async () => {
  try {
    await axiosInstance.get("user/users/validate-token");
    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};
