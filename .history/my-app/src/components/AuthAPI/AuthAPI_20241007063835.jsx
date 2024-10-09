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
    console.log("Sending request to register user with data:", formData); 

    const response = await axiosInstance.post(
      `${API_BASE_URL}/register`,
      formData
    );
    console.log("Response from register endpoint:", response.data); 

    return response.data;
  } catch (error) {
    console.error("Error in registerUser:", error); 
    const errorMessage = error.response?.data?.error || "Registration failed";
    throw new Error(errorMessage);
  }
};


// COMPANY REGISTER
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


//LOGIN
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
  if (!companyCode) {
    console.warn("Company code is required to fetch users");
    return [];
  }
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
  if (!companyCode) {
    console.warn("Company code is required to fetch admin users");
    return [];
  }
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




// fetchCandidatesById: Function to Fetch Candidates from the Backend
const fetchCandidatesById = async (electionId) => {
  try {
    if (!electionId || electionId.length !== 24) {
      console.warn("Invalid election ID provided:", electionId);
      return [];
    }

    const response = await axiosInstance.get(
      `/election/elections/candidates/${electionId}`
    );

    if (response.status === 200 && response.data && response.data.candidates) {
      console.info(
        "Successfully fetched candidates for election ID:",
        electionId
      );
      return response.data.candidates;
    } else {
      console.warn(
        "No candidates found in response for election ID:",
        electionId
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching candidates by election ID:", error.message);
    return [];
  }
};



// UPDATE USER ROLE

export const updateUserRole = async (userId, role) => {
  if (!userId) throw new Error("Invalid user ID");

  try {
 const response = await axiosInstance.put(`${BASE_URL}/user/${userId}/role`, {
   role,
 });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
};

export const fetchUserById = async (userId) => {
  if (!userId) throw new Error("Invalid user ID");

  try {
 const response = await axiosInstance.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user data"
    );
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


// POST ELECTION VOTE CANDIDATE

const postVote = async (electionId, candidateId) => {
  if (!electionId || !candidateId) {
    console.error("Invalid parameters for postElectionVote");
    return;
  }
  try {
    const response = await axiosInstance.post(
      `/election/elections/${electionId}/vote`,
      { candidateId }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to cast vote");
    throw error;
  }
};


// GET ELECTION BY ID

const getElectionsByTheirId = async (electionId) => {
  if (!electionId) {
    console.error("Invalid election ID for getElectionsByTheirId");
    return null;
  }
  try {
    const response = await axiosInstance.get(
      `/election/elections/upcoming-elections/${electionId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch election data");
    throw error;
  }
};


// GET ELECTION BY COMPANY CODE 

const GetUpComingElections = async (companyCode) => {
  if (!companyCode) {
    console.warn("Company code is missing:", companyCode);
    return null;
  }

  try {
    const response = await axiosInstance.get(
      `/election/elections/${companyCode}`
    );

    if (response.status === 200 && response.data && response.data.elections) {
      console.info(
        "Successfully fetched elections for company code:",
        companyCode
      );
      return response.data.elections;
    } else {
      console.warn("No election data found for company code:", companyCode);
      return [];
    }
  } catch (error) {
    console.error("Error fetching upcoming elections:", error.message);
    return [];
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
  if (!companyCode) throw new Error("Company code is undefined or null");

  try {
    const response = await axios.get(
      `${BASE_URL}/topic/topics/byCompanyCode/${companyCode}`
    );
    return response.data.topics; 
  } catch (error) {
    handleApiError(error, "Error fetching topics");
    throw error; 
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
  if (!userId) {
    console.warn("fetchReminder: userId is undefined or null");
    return null;
  }

  try {
    const response = await axiosInstance.get(`/reminder/reminders/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch reminder");
    throw error; 
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





const getPastElections = async (userId) => {
  if (!userId) return [];
  try {
    const response = await axiosInstance.get(`/pastElection/voted/${userId}`);
    return response.data.passedElections;
  } catch (error) {
    handleApiError(error, "Failed to fetch past elections");
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


const createConversation = async (participantIds, title) => {
  try {
    const response = await axiosInstance.post(`/message/message/conversation`, {
      participantIds,
      title,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create conversation");
    throw error;
  }
};

// Send a message
const sendMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post(`/message/message`, messageData);
    console.info("Successfully sent message:", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to send message");
    throw error;
  }
};


// Get reminders by user ID
const getReminders = async (userId) => {
  if (!userId) {
    console.warn("getReminders: userId is required");
    return [];
  }
  try {
    const response = await axiosInstance.get(
      `/message/reminder/reminders/${userId}`
    );
    return response.data.reminders || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch reminders");
    throw error;
  }
};

// Get messages by user ID
// In AuthAPI.js or related API file
 const getMessages = async (conversationId) => {
  if (!conversationId) {
    console.warn("getMessages: Conversation ID is required");
    return [];
  }
  try {
    const response = await axiosInstance.get(`/message/message/${conversationId}`);
    console.info(`Successfully fetched messages for conversation: ${conversationId}`);
    return response.data.messages || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch messages");
    throw error;
  }
};


// Get all conversations for a user
const getConversations = async () => {
  try {
    const response = await axiosInstance.get(`/message/message/sentMessages`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch conversations");
    throw error;
  }
};




const fetchSentMessages = async () => {
  try {
    const response = await axiosInstance.get(`/message/messages/sentMessages`); // Make sure the endpoint is correct
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch sent messages");
    throw error;
  }
};

// Get all messages in a conversation
const getConversationMessages = async (conversationId) => {
  if (!conversationId) {
    console.warn("getConversationMessages: conversationId is required");
    return [];
  }
  try {
    const response = await axiosInstance.get(
      `/message/message/conversation/${conversationId}/messages`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch conversation messages");
    throw error;
  }
};

export {
  login,
  registerUser,
  postVote,
  registerCompany,
  getUsersByCompanyCode,
  getAdminUsers,
  getUserById,
  fetchUserById,
  updateUserRole,
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
  createConversation,
  fetchSentMessages,
  sendMessage,
  getReminders,
  getConversations,
  getConversationMessages,
};