import axios from "axios";
import {
  setStoredUser,
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";
// import dotenv from "dotenv";
// dotenv.config();

const API_BASE_URL = "http://localhost:3001/auth";

export const loginUser = async (formData) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, formData);

    const { user, token } = data;

    if (!user || !user.id || !user.username) {
      throw new Error("Invalid user data received");
    }

    setStoredUser(user);
    setStoredToken(token);

    return user;
  } catch (error) {
    console.error("Login failed:", error);

    throw new Error(
      error.response?.data?.error || "Invalid username or password."
    );
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

// export const getUserDetails = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/generate-token`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     throw error;
//   }
// };
