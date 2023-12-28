// AuthAPI.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth"; 
const BASE_URL = "http://localhost:3000";


const login = async (formData, isCompany = false) => {
  const endpoint = isCompany
    ? `${API_BASE_URL}/company/login`
    : `${API_BASE_URL}/login`;

  try {
    const response = await axios.post(endpoint, formData);
    return response.data;
  } catch (error) {
    const errorMessage = isCompany ? "Company login failed" : "Login failed";
    throw new Error(error.response.data.message || errorMessage);
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
