import axios from "axios";
import axiosInstance from "../../components/axiosInstance";

const BASE_URL = "http://localhost:3001";
const API_BASE_URL = `${BASE_URL}/auth`;

const handleApiError = (error, message) => {
  console.error(`${message}:`, error);
  throw new Error(error.response?.data?.error || message);
};

const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/register`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Registration failed");
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
    handleApiError(error, "Company registration failed");
  }
};

const login = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/login`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Login failed");
  }
};

// Token and User Validation
const refreshTokenFunction = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${API_BASE_URL}/token`, {
      refreshToken,
    });
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

const validateUserToken = async () => {
  try {
    const response = await axiosInstance.get("/user/users/validate-token");
    return response.data;
  } catch (error) {
    handleApiError(error, "Token validation failed");
  }
};

// User Management
const getUsersByCompanyCode = async (companyCode) => {
  if (!companyCode) return [];
  try {
    const response = await axiosInstance.get(
      `/user/users/byCompanyCode/${companyCode}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Error fetching users by company code");
  }
};

const getAdminUsers = async (companyCode) => {
  try {
    const response = await axiosInstance.get(`/user/admins/${companyCode}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch admin users");
  }
};

const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/user/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error fetching user by ID");
  }
};

const fetchCandidatesById = async (electionId) => {
  try {
    const response = await axiosInstance.get(`/election/candidates/${electionId}`);
    return response.data.candidates || []; 
  } catch (error) {
    console.error("Error fetching candidates by election ID:", error);
    throw error;
  }
};




const updateUserRoleToAdmin = async (userId) => {
  if (!userId) throw new Error("Invalid user ID");
  try {
    const response = await axios.put(`${BASE_URL}/user/user/${userId}/role`, {
      role: "Admin",
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update user role");
  }
};

// Elections and Topics Management
const createElection = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/election/create-election",
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create election");
  }
};

const saveElection = async (electionData) => {
  try {
    const electionIds = Array.isArray(electionData)
      ? electionData.map((data) => data.electionId)
      : [electionData.electionId];
    const response = await axiosInstance.post("/savedElection/save-elections", {
      electionIds,
    });

    return response.status === 201
      ? { success: true, user: response.data.user }
      : { success: false, user: null, error: "Failed to save election" };
  } catch (error) {
    handleApiError(error, "Failed to save election");
  }
};

const createTopic = async (formData) => {
  try {
    const response = await axiosInstance.post("/topic/topics", formData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Error creating topic");
  }
};

const updateTopicVote = async (userId, topicId, action) => {
  const endpoint = action === "like" ? "like" : "dislike";
  try {
    const response = await axiosInstance.post(
      `/vote/topics/${topicId}/${endpoint}`,
      { userId }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `Error ${action}ing the topic`);
  }
};

// New Missing Functions
const GetTopicsByCode = async (companyCode) => {
  try {
    if (!companyCode) throw new Error("Company code is undefined or null");
    const response = await axios.get(
      `${BASE_URL}/topic/topics/byCompanyCode/${companyCode}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Error fetching topics");
  }
};

const updateUserProfileLike = async (userId, electionId) => {
  try {
    const response = await axiosInstance.post(`/user/users/vote`, {
      userId,
      electionId,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Error updating user profile like");
  }
};

const topicLike = async (userId, topicId) => {
  return updateTopicVote(userId, topicId, "like");
};

const dislikeTopicLike = async (userId, topicId) => {
  return updateTopicVote(userId, topicId, "dislike");
};

// Reminders
const newReminder = async (formData) => {
  try {
    const response = await axiosInstance.post("/reminder/reminders", formData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create reminder");
  }
};

const fetchReminder = async (userId) => {
  try {
    const response = await axiosInstance.get(`/reminder/reminders/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch reminder");
  }
};

const handleDeleteReminder = async (reminderId) => {
  try {
    const response = await axiosInstance.delete(
      `/reminder/reminders/${reminderId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete reminder");
  }
};

// Elections Data
const getElectionsByTheirId = async (companyCode, electionId) => {
  if (!companyCode || !electionId) return [];
  try {
    const response = await axiosInstance.get(
      `/election/upcoming-elections/${electionId}?companyCode=${companyCode}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch election data");
  }
};

const GetUpComingElections = async (companyCode, electionId) => {
  if (!companyCode || !electionId) {
    console.warn(
      "Company code or election ID is missing:",
      companyCode,
      electionId
    );
    return null;
  }

  try {
    const response = await axiosInstance.get(
      `/election/election/${electionId}?companyCode=${companyCode}`
    );
    console.info("Successfully fetched election with ID:", electionId);
    return response.data?.election || null;
  } catch (error) {
    handleApiError(error, "Failed to fetch upcoming elections");
    return null;
  }
};



const getPastElections = async (userId) => {
  if (!userId) return [];
  try {
    const response = await axiosInstance.get(`/pastElection/voted/${userId}`);
    return response.data.passedElections;
  } catch (error) {
    handleApiError(error, "Failed to fetch past elections");
  }
};

// GET MESSAGES
const getMessages = async (userId) => {
  if (!userId) {
    console.warn("getMessages: userId is required");
    return [];
  }
  try {
    const response = await axiosInstance.get(`/message/messages/${userId}`);
    return response.data.messages || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch messages");
    return []; 
  }
};



const getSavedElections = async (userId) => {
  if (!userId) return [];
  try {
    const response = await axiosInstance.get(
      `/savedElection/saved-elections/${userId}`
    );
    return response.data.savedElections || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch saved elections");
  }
};

// News
const createCompanyNews = async (formData) => {
  try {
    const response = await axiosInstance.post("/news/news-post", formData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create company news");
  }
};

const GetUpComingNews = async (companyCode) => {
  if (!companyCode) return [];
  try {
    const response = await axiosInstance.get(
      `/news/byCompanyCode/${companyCode}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch upcoming news");
  }
};

export {
  login,
  registerUser,
  registerCompany,
  getUsersByCompanyCode,
  getAdminUsers,
  getUserById,
  updateUserRoleToAdmin,
  createElection,
  saveElection,
  createTopic,
  updateTopicVote,
  newReminder,
  fetchReminder,
  handleDeleteReminder,
  getElectionsByTheirId,
  GetUpComingElections,
  getPastElections,
  getSavedElections,
  createCompanyNews,
  GetUpComingNews,
  GetTopicsByCode,
  updateUserProfileLike,
  topicLike,
  dislikeTopicLike,
  refreshTokenFunction,
  validateUserToken,
  fetchCandidatesById,
  getMessages,
};