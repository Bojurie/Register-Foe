import axios from "axios";

const BASE_URL="http://localhost:3000 "
const API_BASE_URL = "http://localhost:3000/auth";




const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    return response.data.user || null;
  } catch (error) {
   console.log(error);
  }
};

const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData);
    return response.data;
  } catch (error) {
   console.log(error, "Registration failed");
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
   console.log(error, "Company registration failed");
  }
};

const saveElection = async (electionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/savedElection/save-election`, electionData);
    return response.data;
  } catch (error) {
    console.log(error, "Saving election failed");
  }
};

const createElection = async (formData, token) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(
      `${BASE_URL}/election/create-election`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error in createElection:", error);
    throw new Error(error.response?.data?.error || "Creating election failed");
  }
};






const createTopic = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/topic/topics`, formData);
    return response.data;
  } catch (error) {
  console.log(error, "Saving election failed");
  }
};


export {
  login,
  createTopic,
  registerUser,
  registerCompany,
  createElection,
  saveElection,
};
