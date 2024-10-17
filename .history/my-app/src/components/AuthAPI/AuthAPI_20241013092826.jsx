import axios from "axios";
import axiosInstance from "../../components/axiosInstance";
import { toast } from "react-toastify";
import { enqueueSnackbar } from "notistack";

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

// USER LOGIN

const login = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/login`,
      formData
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Invalid credentials. Please try again.");
    } else {
      console.error("Login failed:", error.message);
    }
    throw error;
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

 const updateUserRole = async (userId, role) => {
  if (!userId) throw new Error("Invalid user ID");

  try {
 const response = await axiosInstance.put(`${BASE_URL}/user/user/${userId}/role`, {
   role,
 });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user role"
    );
  }
};

 const fetchUserById = async (userId) => {
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
    console.error("Invalid parameters for postVote");
    return;
  }
  try {
    const response = await axiosInstance.post(`/election/elections/${electionId}/vote`, {
      candidateId,
    });
    return response.data;
  } catch (error) {
    console.error("Error voting for candidate:", error);
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





const updateTopicVote = async (userId, topicId, action) => {
  try {
    const endpoint = action === "like" ? "like" : "dislike";
    const response = await axiosInstance.post(
      `/vote/topics/${topicId}/${endpoint}`,
      {
        userId,
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error, `Error ${action}ing the topic`);
    throw error;
  }
};



// POST NEW REMINDER 
const newReminder = async (formData) => {
  try {
    const response = await axiosInstance.post("/reminder/reminders", formData);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to create reminder";
    toast.error(errorMessage); 
    throw error; 
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



// GET PAST ELECTION

const getPastElections = async (userId) => {
  if (!userId) return [];

  try {
    const response = await axiosInstance.get(`/pastElection/voted/${userId}`);
    return response.data.votedPastElections;
  } catch (error) {
    // Log the error and return an appropriate message to the user
    console.error(
      "Error fetching past elections:",
      error.response?.data || error.message
    );
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
// Updated sendMessage function
const sendMessage = async (messageData) => {
  try {
    console.log("API request with messageData:", messageData);
    const response = await axiosInstance.post(`/message/message`, messageData); // Ensure correct route is used
    console.info("Successfully sent message:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to send message:",
      error.response?.data || error.message
    );
    throw error; // Rethrow error so it can be handled by the calling function
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
    const response = await axiosInstance.get(`/message/messages`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch conversations");
    throw error;
  }
};




const fetchSentMessages = async () => {
  try {
    console.log("Fetching sent messages...");
    const response = await axiosInstance.get(`/message/messages/sent`);
    console.info("Successfully fetched sent messages:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch sent messages:",
      error.response?.data || error.message
    );
    throw error;
  }
};


// HANDLING PROFILE LIKES
const updateUserProfileLike = async (userId) => {
  try {
    const response = await axiosInstance.post(`/user/users/${userId}/like`);
    if (!response.data || typeof response.data.profileLikes === "undefined") {
      throw new Error("Invalid response from server");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating user profile like:", error);
    throw error;
  }
};


// NEWS INDICATOR READING
const newsReading = async (newsId, userId) => {
  try {
    const response = await axiosInstance.post(`/news/markAsRead/${newsId}`, {
      userId, 
    });

    if (!response.data || !response.data.success) {
      throw new Error(
        `Failed to mark news as read. Server responded with: ${response.statusText}`
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error marking news as read:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// UPDATED READ NEWS INDICATOR
const getNewsReading = async (newsId, userId) => {
  try {
    const response = await axiosInstance.patch(`/news/markAsRead/${newsId}`, {
      userId, 
    });

    if (!response.data || !response.data.success) {
      throw new Error(
        `Failed to mark news as read. Server responded with: ${response.statusText}`
      );
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error marking news as read:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// GET LIKES AND DISLIKES 

const getReactionsNow = async (topicId, action) => {
  try {
    console.log(`Making GET request to: /vote/topics/${topicId}/${action}`);

    const response = await axiosInstance.get(`/vote/topics/${topicId}/${action}`);
    
    console.log(`Received response for ${action}:`, response.data);

    // Check for the presence of likesCount or dislikesCount instead of 'count'
    if (response.data && (response.data.likesCount !== undefined || response.data.dislikesCount !== undefined)) {
      return response.data;
    } else {
      throw new Error(`Invalid response for ${action}: likesCount or dislikesCount is missing.`);
    }
  } catch (error) {
    console.error(`Error fetching ${action}:`, error.message);
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

// POSTING LIKES / DISLIKES
const apiUpdateTopicVote = async (userId, topicId, action) => {
  try {
    // Dynamically choose the endpoint based on the action
    const response = await axiosInstance.post(
      `/vote/topics/${topicId}/${action}`,
      {
        userId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error updating vote (${action}):`, error);
    throw error;
  }
};


const postComment = async (commentData) => {
  try {
    const response = await axiosInstance.post(
      `/topic/topics/${commentData.topicId}/comments`,
      commentData
    );
    console.info("Successfully posted comment:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to post comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export {
  login,
  registerUser,
  postVote,
  registerCompany,getReactionsNow,
  getUsersByCompanyCode,
  getAdminUsers,
  getUserById,
  fetchUserById,
  postComment,
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
  refreshTokenFunction,
  validateUserToken,
  fetchCandidatesById,
  getMessages,
  createConversation,
  fetchSentMessages,
  newsReading,
  sendMessage,
  getReminders,
  getConversations,
  getConversationMessages,
  apiUpdateTopicVote,
  getNewsReading,
};