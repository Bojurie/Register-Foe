import axios from "axios";

const BASE_URL="http://localhost:3000 "
const API_BASE_URL =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:3000/auth";



const handleError = (error) => {
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
  }
  throw error;
};

const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
    return response.data.user || null;
  } catch (error) {
    handleError(error);
  }
};

const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData);
    return response.data;
  } catch (error) {
    handleError(error, "Registration failed");
  }
};

const registerCompany = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/company/register`,
      formData
    );
    return response.data;
  } catch (error) {
    handleError(error, "Company registration failed");
  }
};

const saveElection = async (electionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/savedElection/save-election`, electionData);
    return response.data;
  } catch (error) {
    handleError(error, "Saving election failed");
  }
};

const createTopic = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/topic/topics`, formData);
    return response.data;
  } catch (error) {
    handleError(error, "Saving election failed");
  }
};


export { login, createTopic, registerUser, registerCompany, saveElection };
