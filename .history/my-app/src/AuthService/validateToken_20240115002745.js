import axiosInstance from "../components/axiosInstance";

export const validateToken = async () => {
  try {
    const response = await axiosInstance.get("/user/validate-token");
    return response.data.valid;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Token validation failed:", error.response.data.error);
      return false;
    }
    console.error("Error validating token:", error);
    return false;
  }
};
