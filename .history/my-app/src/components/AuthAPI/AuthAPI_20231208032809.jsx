// AuthAPI.js
import axios from "axios";
import { setStoredUser } from "../LocalStorageManager/LocalStorageManager";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post("/auth/login", formData);
    const user = response.data;

    if (!user || typeof user.id === "undefined") {
      throw new Error("Invalid response from the server");
    }

    // Store user data in local storage
    setStoredUser(user);

    return user;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Invalid username or password.";
    console.error("Login failed:", errorMessage);
    throw new Error(errorMessage);
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
