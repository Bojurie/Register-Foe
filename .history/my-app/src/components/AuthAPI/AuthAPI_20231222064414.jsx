import axios from "axios";
import {
  setStoredUser,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const API_BASE_URL = "http://localhost:3001/auth";
const BASE_URL = "http://localhost:3001/";

// Utility function to get auth headers
const getAuthHeaders = () => {
  const token = getStoredToken();
  if (!token) throw new Error("Authentication token not found.");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const loginUser = async (formData) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, formData);
    if (!data.user || !data.token)
      throw new Error("Invalid user data received");
    setStoredUser(data.user);
    setStoredToken(data.token);
    return data.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData);
    if (response.status !== 201) throw new Error("Registration failed");
    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const saveElection = async (electionData) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.post(
      `${BASE_URL}savedElection/save-election`,
      electionData,
      headers
    );
    if (response.status !== 201 || !response.data)
      throw new Error("Failed to save election");
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error("Error in saving election:", error);
    throw error;
  }
};
