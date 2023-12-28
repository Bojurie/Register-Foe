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


const GetUsersByCode = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user/users/byCompanyCode`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users by company code:", error);
    throw error; // Propagating the error for handling by the caller
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


const verifyCompanyCode = async (companyCode) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/company/verifyCode/:companyCode/${companyCode}`
    );
    // Assuming the API returns a boolean or some meaningful data to indicate if the code is valid
    return response.data;
  } catch (error) {
    console.error("Error verifying company code:", error);
    throw error; // Throw error to be handled by the caller
  }
};



const createElection = async (formData, token) => {
  try {
    const fullUrl = `${BASE_URL}/election/create-election`;
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
      `${BASE_URL}/topic/topics?companyCode=${companyCode}`
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

const createTopic = async (formData, token) => {
  try {
    console.log("Sending topic data:", formData); // For debugging
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(
      `${BASE_URL}/topic/topics`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error; // Rethrow the error for handling in the calling function
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
  verifyCompanyCode,
};
