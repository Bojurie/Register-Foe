import axiosInstance from "../components/axiosInstance";

export const validateToken = async () => {
  try {
    await axiosInstance.get("/validate-token"); 
    return true;
  } catch (error) {
    return false;
  }
};
