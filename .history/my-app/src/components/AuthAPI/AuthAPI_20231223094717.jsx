// AuthAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth"; 
const BASE_URL = "http://localhost:3000";


const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    console.log("Login API response:", response);

    // Check for user data in the response
    if (response.data && response.data.user) {
      // Handle user data as needed, e.g., store in context or local storage
      // If you need a token, ensure the backend sends it and then retrieve here

      return response.data.user; // or return the token if it's part of the user object
    } else {
      console.error("Invalid login response:", response);
      throw new Error("Invalid login response");
    }
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(errorMessage);
  }
};



const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Registration failed");
  }
};



const registerCompany = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/company/register`, formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Company registration failed"
    );
  }
};

const saveElection = async (electionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/elections`, electionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Saving election failed");
  }
};

export { login, registerUser, registerCompany, saveElection };
