import axios from "axios";

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
    const response = await axios.get(
      `${BASE_URL}/user/users/byCompanyCode/${companyCode}`
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

const createElection = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/election/create-election`, formData);
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
      `${BASE_URL}/topic/topics?companyCode=${companyCode}`
    );
    console.log(response)
    return response && response.data ? response.data : [];
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};


const GetUpComingElections = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3001/election/upcoming-elections"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);
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
    throw {
      message: error.response?.data?.error || "An error occurred during login.",
      statusCode: error.response?.status,
    };
  }
};

export {
  login,
  createTopic,
  GetUpComingElections,
  registerUser,
  getUsersByCompanyCode,
  registerCompany,
  voteForUser,
  likeUser,
  createElection,
  saveElection,
  GetTopicsByCode,
  verifyCompanyCode,
  refreshTokenFunction,
};
