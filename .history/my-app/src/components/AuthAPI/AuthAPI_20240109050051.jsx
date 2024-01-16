import axios from "axios";
import axiosInstance from "../../components/axiosInstance";
const uuidRandom = require('uuid-random'); 

const BASE_URL = "http://localhost:3001";
const API_BASE_URL = "http://localhost:3001/auth";


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

const getUsersByCompanyCode = async (companyCode) => {
  if (!companyCode) {
    console.error("Company code is missing");
    return [];
  }
  try {
    const response = await axiosInstance.get(
      `/user/users/byCompanyCode/${companyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching users by company code:", error);
    return null;
  }
};

const likeUser = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/like`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error in liking user:", error);
    throw error;
  }
};


const getAdminUsers = async (companyCode) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/admins`, {
      params: { companyCode },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching admin users:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error || "Failed to fetch admin users"
    );
  }
};



const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user by ID:",
      error.response?.data || error.message
    );
    return null; // Return null or an error object
  }
};


const voteForUser = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/vote`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error in voting for user:", error);
    throw error;
  }
};

const refreshTokenFunction = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await axios.post("/auth/token", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

export default refreshTokenFunction;

const saveElection = async (electionData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/savedElection/save-election`,
      electionData
    );
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
    return response.data;
  } catch (error) {
    console.error("Error verifying company code:", error);
    throw error;
  }
};



// Frontend: createElection function
const createElection = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/election/create-election",
      formData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in createElection:",
      error.response?.data?.error || error.message
    );
    throw new Error(error.response?.data?.error || "Failed to create election");
  }
};








const updateUserRoleToAdmin = async (userId) => {
  if (!userId) {
    console.error(
      "Invalid or undefined userId passed to updateUserRoleToAdmin"
    );
    throw new Error("Invalid user ID");
  }

  try {
    console.log("Updating role for User ID:", userId); // Debugging
    const url = `${BASE_URL}/user/user/${userId}/role`; // Corrected URL
    console.log("Request URL:", url); // Debugging

    const response = await axios.put(url, { role: "Admin" });
    return response.data;
  } catch (error) {
    console.error(
      "Error in updateUserRoleToAdmin:",
      error.response?.data || error.message
    );
    throw new Error(
      (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        "Failed to update user role"
    );
  }
};




const createTopic = async (formData) => {
  try {
    const response = await axiosInstance.post(`/topic/topics`, formData); 
    return response.data;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error; 
  }
};




const GetTopicsByCode = async (companyCode) => {
  try {
    if (!companyCode) {
      console.error("Company code is undefined or null");
      return [];
    }
    const response = await axios.get(
      `${BASE_URL}/topic/topics/byCompanyCode/${companyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

 

const GetUpComingElections = async (companyCode) => {
  try {
    if (!companyCode) {
      console.error("Company code is undefined or null");
      return [];
    }
    const response = await axiosInstance.get(
      `/election/upcoming-elections/byCompanyCode/${companyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);
    throw error;
  }
};




const getElectionsByTheirId = async (companyCode, electionId) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Received companyCode: ${companyCode}, electionId: ${electionId}`);
  }

  try {
    if (!companyCode || !electionId) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Company code or electionId is undefined or null");
      }
      return [];
    }

    const response = await axios.get(`/election/upcoming-elections/${electionId}?companyCode=${companyCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching election data:", error);
    throw error;
  }
};




const login = async (formData) => {
  try {
    const response = await axiosInstance.post("/auth/login", formData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "An error occurred during login.";
    console.error("Login error:", errorMessage);
    throw new Error(errorMessage);
  }
};


export {
  login,
  createTopic,
  updateUserRoleToAdmin,
  GetUpComingElections,
  registerUser,
  getUsersByCompanyCode,
  getAdminUsers,
  registerCompany,
  voteForUser,
  likeUser,
  getUserById,
  getElectionsByTheirId,
  createElection,
  saveElection,
  GetTopicsByCode,
  verifyCompanyCode,
  refreshTokenFunction,
};