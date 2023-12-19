import axios from "axios";
import { useAuth } from "../AuthContext/AuthContext";

const API_BASE_URL = "http://localhost:3001/auth";

export const loginUser = async (formData, login) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, formData);
    const { user, token } = data;

    if (!user || !user.id || !user.username || !token) {
      throw new Error("Invalid user data received");
    }

    login(user); // Dispatch the LOGIN_SUCCESS action
    return user;
  } catch (error) {
    console.error("Login failed:", error);

    if (error.response) {
      console.error("Server response:", error.response.data);
    }

    throw new Error("Login failed. Please try again.");
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