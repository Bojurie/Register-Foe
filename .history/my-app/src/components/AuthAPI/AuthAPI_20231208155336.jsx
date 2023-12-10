// AuthAPI.js
import axios from "axios";
import { setStoredUser } from "../LocalStorageManager/LocalStorageManager";

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL;

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, formData);
    const user = response.data;

    if (!user || typeof user.id === "undefined") {
      throw new Error("Invalid response from the server");
    }

    // Store user data in local storage
    setStoredUser(user);

    // Request the server to generate a token
    const tokenResponse = await axios.post(`${BASE_URL}/auth/generate-token`, {
      userId: user.id,
    });

    // Store the token in local storage
    const token = tokenResponse.data.token;
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
    const response = await axios.post("/auth/register", formData);

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


export const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/user-details`);
    const { user, token } = response.data;

    // Store user data and token in local storage
    setStoredUser(user);
    setStoredToken(token);

    return user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
