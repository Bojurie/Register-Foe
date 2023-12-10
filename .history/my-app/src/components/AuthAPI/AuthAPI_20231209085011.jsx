import axios from "axios";
import {
  setStoredUser,
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/auth/login",
      formData
    );

    const { id, username, token } = response.data;

    if (!id || !username || !token) {
      throw new Error("Invalid response from the server");
    }

    setStoredUser({ id, username });
    setStoredToken(token);

    return { id, username };
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(
      error.response?.data?.error || "Invalid username or password."
    );
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/auth/register",
      formData
    );

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

// Fetch user details from the server
export const getUserDetails = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3001/auth/generate-token"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
