import axios from "axios";
import {
  setStoredUser,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

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

export const saveElection = async (electionData) => {
  console.log(token);

  try {
    const API_BASE_URL = "http://localhost:3000";
    const token = getStoredToken();
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/savedElection/save-election`,
      electionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      console.log("Election saved successfully:", response.data);
      return { success: true, message: response.data.message };
    } else {
      throw new Error(response.data.error || "Failed to save election");
    }
  } catch (error) {
    console.error("Error saving election:", error);
    throw new Error(
      "An error occurred while saving the election. Please try again."
    );
  }
};
