import axiosInstance from "../components/axiosInstance";

export const validateToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { valid: false, error: "No token found" };
  }
  try {
    const response = await axiosInstance.get("/user/users/validate-token");
    return { valid: response.data.isValid };
  } catch (error) {
    return { valid: false, error: "Token validation error" };
  }
};


