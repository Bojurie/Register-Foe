import axiosInstance from "../components/axiosInstance"; // Import axiosInstance

export const validateToken = async () => {
  try {
    await axiosInstance.get("/user/validate-token");
    return true; 
  } catch (error) {
    return false; 
  }
};
