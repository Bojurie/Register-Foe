// AuthAPI.js
import axios from "axios";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post("/auth/login", formData);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error("Invalid username or password.");
  }
};

export const fetchUserDetails = async () => {
  try {
    const response = await axios.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
