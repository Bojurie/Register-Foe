import axiosInstance from "../components/axiosInstance";

export const validateToken = async () => {
  try {
    await axiosInstance.get("/user/validate-token"); // Ensure the path matches your Express route
    return true;
  } catch (error) {
    return false;
  }
};
