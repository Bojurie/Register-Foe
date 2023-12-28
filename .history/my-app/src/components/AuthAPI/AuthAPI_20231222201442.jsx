// AuthAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth"; // Replace with your actual API base URL
const BASE_URL = "http://localhost:3000";
const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Login failed");
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

const loginCompany = async (formData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/company/login`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || "Company login failed");
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

export { loginUser, registerUser, loginCompany, registerCompany, saveElection };
