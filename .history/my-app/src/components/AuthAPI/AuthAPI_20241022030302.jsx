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
    const response = await axiosInstance.post(
      `${API_BASE_URL}/register`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Company registration failed");
    throw error;
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

// GET USERS BY COMPANY CODE
const getUsersByCompanyCode = async (companyCode) => {
  if (!companyCode) {
    console.warn("Company code is required to fetch users");
    return [];
  }
  try {
    const response = await axiosInstance.get(
      `/user/users/byCompanyCode/${companyCode}`
    );

    if (response.status === 200 && response.data.users) {
      console.info("Users successfully fetched:", response.data.users.length);
      return response.data.users;
    } else {
      console.warn(`No users found for company code: ${companyCode}`);
      return [];
    }
  } catch (error) {
    console.error(
      "Error fetching users by company code:",
      error.response?.data?.error || error.message
    );
    return [];
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
 const response = await axiosInstance.get(`${BASE_URL}/user/users/${userId}`);
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
    const response = await axiosInstance.get(`/election/elections`);

    if (response.status === 200) {
      const elections = response.data;

      if (elections && elections.length > 0) {
        console.info(
          "Successfully fetched elections for company code:",
          companyCode
        );
        return elections; // Return the list of elections
      } else {
        console.warn(
          "No upcoming elections found for company code:",
          companyCode
        );
        return []; // Return an empty array if no elections are found
      }
    }
  } catch (error) {
    console.error("Error fetching upcoming elections:", error.message);
    return []; // Return an empty array in case of an error
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



// GET TOPIC BY COMPANY CODE
const GetTopicsByCode = async (companyCode) => {
  if (!companyCode) throw new Error("Company code is undefined or null");

  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/topic/topics/byCompanyCode/${companyCode}`
    );

    if (response.status === 200 && response.data.topics) {
      console.info(
        `Successfully fetched topics for company code: ${companyCode}`
      );
      return response.data.topics;
    } else if (response.status === 404) {
      console.warn(`No topics found for company code: ${companyCode}`);
      return [];
    } else {
      console.error(
        `Unexpected response for company code ${companyCode}:`,
        response
      );
      return [];
    }
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




// GET PAST ELECTION BY COMPANY CODE

const getPastElections = async (companyCode) => {
  if (!companyCode) {
    throw new Error("Company code is required to fetch past elections.");
  }

  try {
    const response = await axiosInstance.get(
      `/election/elections/past/${companyCode}`
    );

    if (response.status === 200 && response.data.elections) {
      console.info(
        `Successfully fetched past elections for company code: ${companyCode}`
      );
      return response.data.elections; // Return the elections data
    } else {
      console.warn(`No past elections found for company code: ${companyCode}`);
      return []; // Return an empty array if no elections are found
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`No past elections found for company code: ${companyCode}`);
      return []; // Handle 404 error and return an empty array
    }
    console.error("Error fetching past elections:", error);
    throw error; // Throw the error for further handling
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


// GET NEWS BY COMANY CODE
const GetUpComingNews = async (companyCode) => {
  if (!companyCode) return { news: [], message: "Company code is required." };

  try {
    const response = await axiosInstance.get(
      `/news/byCompanyCode/${companyCode}`
    );
    return response.data; 
  } catch (error) {
    handleApiError(error, "Failed to fetch upcoming news");
    return { news: [], message: "Failed to fetch news." }; 
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

// Axios function to send a message
const sendMessage = async (messageData) => {
  try {
    console.log("Sending message with data:", messageData);
    const response = await axiosInstance.post("/message/messages", messageData);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to send message:",
      error.response?.data || error.message
    );
    throw error;
  }
};


// Axios function to send a reply
const replyMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post(`/message/messages/reply`, messageData);
    console.info("Reply sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send reply:", error.response?.data || error.message);
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
    const response = await axiosInstance.get(`/message/messages/${conversationId}`);
    console.info(`Successfully fetched messages for conversation: ${conversationId}`);
    return response.data.messages || [];
  } catch (error) {
    handleApiError(error, "Failed to fetch messages");
    throw error;
  }
};


// GET INBOX MESSAGE
const getConversations = async (conversationId) => {
  try {
    const response = await axiosInstance.get(
      `/message/messages/${conversationId}`
    );

    if (response.status !== 200) {
      console.warn("Unexpected response status:", response.status);
      return [];
    }

    const messages = response.data;

    if (!messages || messages.length === 0) {
      console.info("No messages found for this user.");
      return [];
    }

    console.info("Successfully fetched inbox messages:", messages);
    return messages;
  } catch (error) {
    console.error("Failed to fetch inbox messages:", error);
    throw new Error("Failed to fetch inbox messages");
  }
};




// const getConversations = async (conversationId) => {
//   try {
//     const response = await axiosInstance.get(
//       `/message/messages/${conversationId}`
//     );

//     if (response.status !== 200) {
//       console.warn("Unexpected response status:", response.status);
//       return [];
//     }

//     const messages = response.data;

//     if (!messages || messages.length === 0) {
//       console.info("No messages found for this conversation.");
//       return [];
//     }

//     console.info("Successfully fetched inbox messages:", messages);

//     return messages;
//   } catch (error) {
//     console.error("Failed to fetch inbox messages:", error);
//     throw new Error("Failed to fetch inbox messages");
//   }
// };





//  GET OUTBOX MESSAGE
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

    const response = await axiosInstance.get(`/vote/topics/${topicId}/${action}`);
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
  replyMessage,
  getConversations,
  getConversationMessages,
  apiUpdateTopicVote,
  getNewsReading,
};