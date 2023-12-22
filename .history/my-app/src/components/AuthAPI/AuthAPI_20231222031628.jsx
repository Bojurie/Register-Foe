import axios from "axios";
import {
  setStoredUser,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const API_BASE_URL = "http://localhost:3001/auth";

export const loginUser = async (formData) => {
  const { data } = await axios.post(`${API_BASE_URL}/login`, formData);
  const { user, token } = data;

  if (!user || !token) {
    throw new Error("Invalid user data received");
  }

  setStoredUser(user);
  setStoredToken(token);
  return user;
};

export const registerUser = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, formData);

  if (response.status !== 201) {
    throw new Error(response.data.error || "Registration failed");
  }

  return { success: true };
};

export const saveElection = async (electionData) => {
  const token = getStoredToken();
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await axios.post(
    `${API_BASE_URL}/election/save-election`, 
    electionData,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (response.status !== 201) {
    throw new Error(response.data.error || "Failed to save election");
  }

  return { success: true, message: response.data.message };
};