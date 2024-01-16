import axiosInstance from "../components/axiosInstance";

export const validateToken = async () => {
    const token = getStoredToken();

  try {
    await axiosInstance.get("user/users/validate-token", { token });
    return response.data.isValid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};
