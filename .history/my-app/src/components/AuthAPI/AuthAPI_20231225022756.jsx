import axios from "axios";

const BASE_URL="http://localhost:3000"
const API_BASE_URL ="http://localhost:3000/auth";






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
const getUsersByCompanyCode = async (formData) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/users/:companyCode`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log(error, "Company registration failed");
  }
};


const GetUsersByCode = async (formData) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/users/byCompanyCode`,
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
    const fullUrl = `${BASE_URL}/election/create-election`;
    console.log("Posting to URL:", fullUrl); // Debugging line

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(fullUrl, formData, config);
    return response.data;
  } catch (error) {
    console.error("Error in createElection:", error);
    throw new Error(error.response?.data?.error || "Creating election failed");
  }
};



const GetTopicsByCode = async (companyCode) => {
  try {
    const response = await axios.get(
      `/topic/topics?companyCode=${companyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};


const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    console.log("Raw axios response:", response); 
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data?.error || error.message);
    throw error;
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
  getUsersByCompanyCode,
  registerCompany,
  createElection,
  saveElection,
  GetTopicsByCode,
  GetUsersByCode,
};
