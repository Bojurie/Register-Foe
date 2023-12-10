import axios from "axios";
import { setStoredUser } from "./LocalStorageManager";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post("/auth/login", formData);
    const user = response.data;

    // Store user data in local storage
    setStoredUser(user);

    return user;
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
