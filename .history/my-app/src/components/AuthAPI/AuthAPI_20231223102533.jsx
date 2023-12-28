// AuthAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth"; 
const BASE_URL = "http://localhost:3000";


const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    console.log("Login API response:", response);

    if (response.data && response.data.user) {
    
      return response.data.user; 
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
