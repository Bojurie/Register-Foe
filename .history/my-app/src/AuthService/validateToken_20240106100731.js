import axiosInstance from "./components/axiosInstance"; // Import axiosInstance

export const validateToken = async () => {
  try {
    await axiosInstance.get("/validate-token");
    return true; // Token is valid
  } catch (error) {
    return false; // Token is invalid or expired
  }
};
