import axios from "axios";
import { setStoredUser, setStoredToken } from "../LocalStorageManager/LocalStorageManager";

const API_BASE_URL = "http://localhost:3001/auth";

export const loginUser = async (formData) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, formData);
    const { user, token } = data;

    if (!user || !user.id || !user.username || !token) {
      throw new Error("Invalid user data received");
    }

    setStoredUser(user);
    setStoredToken(token);
    return user;
  } catch (error) {
    console.error("Login failed:", error);

    if (error.response) {
      console.error("Server response:", error.response.data);
    }

    throw error;
  }
};

export const registerUser = async (formData) => {
    try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData);

    if (response.status === 201) {
      console.log("Registration successful:", response.data);
      return { success: true };
    } else {
      throw new Error(response.data.error || "Registration failed");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("An error occurred while registering. Please try again.");
  }
};
