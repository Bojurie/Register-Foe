import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { validateToken } from "../../AuthService/validateToken";
import {
  registerUser,
  registerCompany,
  fetchReminder,
  replyMessage,
  newReminder,
  createElection,
  GetTopicsByCode,
  getUsersByCompanyCode,
  createTopic,
  GetUpComingElections,
  GetUpComingNews,
  fetchUserById,
  handleDeleteReminder,
  login,
  postVote,
  updateUserProfileLike,
  MarkNewsAsReading,
  createCompanyNews,
  getAdminUsers,
  getElectionsByTheirId,
  postComment,
  updateUserRole,
  getPastElections,
  newTestimonyPosting,
  getMessages,
  getReactionsNow,
  fetchCandidatesById,
  createConversation,
  sendMessage,
  getReminders,
  getConversations,
  getConversationMessages,
  fetchSentMessages,
  apiUpdateTopicVote,
  newsReading,
} from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  ADD_COMMENT_REQUEST: "ADD_COMMENT_REQUEST",
  ADD_COMMENT_SUCCESS: "ADD_COMMENT_SUCCESS",
  ADD_COMMENT_ERROR: "ADD_COMMENT_ERROR",
  UPDATE_ROLE_SUCCESS: "UPDATE_ROLE_SUCCESS",
  UPDATE_VOTE_REQUEST: "UPDATE_VOTE_REQUEST",
  UPDATE_VOTE_SUCCESS: "UPDATE_VOTE_SUCCESS",
  UPDATE_VOTE_ERROR: "UPDATE_VOTE_ERROR",
  FETCH_LIKES_REQUEST: "FETCH_LIKES_REQUEST",
  FETCH_LIKES_SUCCESS: "FETCH_LIKES_SUCCESS",
  FETCH_DISLIKES_REQUEST: "FETCH_DISLIKES_REQUEST",
  FETCH_DISLIKES_SUCCESS: "FETCH_DISLIKES_SUCCESS",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
  CREATE_ELECTION_SUCCESS: "CREATE_ELECTION_SUCCESS",
  CREATE_ELECTION_ERROR: "CREATE_ELECTION_ERROR",
  CREATE_COMPANY_NEWS_SUCCESS: "CREATE_COMPANY_NEWS_SUCCESS",
  CREATE_COMPANY_NEWS_ERROR: "CREATE_COMPANY_NEWS_ERROR",
  AUTH_CHECK_COMPLETE: "AUTH_CHECK_COMPLETE",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return { ...state, user: action.payload.user, authChecking: false };

    case ActionTypes.LOGOUT:
      return { ...state, user: null, authChecking: false };

    case ActionTypes.AUTH_CHECK_COMPLETE:
      return { ...state, authChecking: false };

    case ActionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user, authChecking: false };

    case ActionTypes.UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        user:
          state.user?._id === action.payload.userId
            ? { ...state.user, role: action.payload.role }
            : state.user,
      };

    case ActionTypes.UPDATE_VOTE_REQUEST:
      return { ...state, isVoting: true };

    case ActionTypes.UPDATE_VOTE_SUCCESS: {
      const updatedTopics = Array.isArray(state.topics)
        ? state.topics.map((topic) =>
            topic._id === action.payload.topicId
              ? {
                  ...topic,
                  likesCount: action.payload.likesCount,
                  dislikesCount: action.payload.dislikesCount,
                }
              : topic
          )
        : [];
      return { ...state, topics: updatedTopics, isVoting: false };
    }

    case ActionTypes.UPDATE_VOTE_ERROR:
      return { ...state, voteError: action.payload.error, isVoting: false };

    case ActionTypes.FETCH_LIKES_REQUEST:
    case ActionTypes.FETCH_DISLIKES_REQUEST:
      return { ...state, loading: true };

    case ActionTypes.FETCH_LIKES_SUCCESS:
      return {
        ...state,
        likesCount: action.payload.likesCount,
        loading: false,
      };

    case ActionTypes.FETCH_DISLIKES_SUCCESS:
      return {
        ...state,
        dislikesCount: action.payload.dislikesCount,
        loading: false,
      };

    case ActionTypes.SAVE_ELECTION_SUCCESS:
      return { ...state, isElectionSaved: true };

    case ActionTypes.SAVE_ELECTION_ERROR:
      return {
        ...state,
        isElectionSaved: false,
        saveElectionError: action.payload.error,
      };

    case ActionTypes.CREATE_COMPANY_NEWS_SUCCESS:
      return { ...state, companyNewsCreated: true };

    case ActionTypes.CREATE_COMPANY_NEWS_ERROR:
      return {
        ...state,
        companyNewsCreated: false,
        companyNewsError: action.payload.error,
      };

    case ActionTypes.CREATE_ELECTION_SUCCESS:
      return { ...state, electionCreated: true };

    case ActionTypes.CREATE_ELECTION_ERROR:
      return {
        ...state,
        electionCreated: false,
        electionError: action.payload.error,
      };

    case ActionTypes.ADD_COMMENT_REQUEST:
      return { ...state, loading: true, error: null };

    case ActionTypes.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        comments: [...state.comments, ...action.payload],
        error: null,
      };

    case ActionTypes.ADD_COMMENT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    authChecking: true,
    electionCreated: false,
    electionError: null,
    isElectionSaved: false,
    saveElectionError: null,
  });
  const navigate = useNavigate();

  // HANDLE AUTHENTICATION
  const handleAuthentication = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      dispatch({ type: ActionTypes.AUTH_CHECK_COMPLETE });
      return;
    }

    const isValidToken = await validateToken(token);
    if (!isValidToken) {
      dispatch({ type: ActionTypes.LOGOUT });
      return;
    }

    const user = getStoredUser();
    if (user && user._id) {
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
    } else {
      dispatch({ type: ActionTypes.LOGOUT });
    }
  }, [dispatch]);

  useEffect(() => {
    handleAuthentication();
  }, [handleAuthentication]);

  //LOGIN
  const handleLogin = useCallback(
    async (formData) => {
      try {
        const { token, user } = await login(formData);
        if (!user._id) throw new Error("User ID is missing in response");

        setStoredToken(token);
        setStoredUser(user);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
        navigate("/main");
        enqueueSnackbar("Login successful!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.error || "Login failed. Please try again.",
          { variant: "error" }
        );
      }
    },
    [navigate, enqueueSnackbar, dispatch]
  );

  // USER REGISTER
  const handleRegister = async (formData) => {
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });
      const response = await registerUser(dataToSend);
      enqueueSnackbar("Registration successful!", { variant: "success" });
      dispatch({
        type: ActionTypes.REGISTER_SUCCESS,
        payload: { user: response.user || response.company },
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleLogout = () => {
    removeStoredToken();
    removeStoredUser();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

  // FTECH ADMIN USERS
  const fetchAdminUsers = useCallback(async (companyCode) => {
    try {
      if (!companyCode) {
        console.error("Company code is undefined or null");
        return [];
      }
      const response = await getAdminUsers(companyCode);
      const admins = response;
      return admins;
    } catch (error) {
      console.error("Error fetching admin users:", error.message);
      return [];
    }
  }, []);

  // GET USERS BY COMPANY CODE
  const fetchUserByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is required to fetch users.");
      return [];
    }

    try {
      const users = await getUsersByCompanyCode(companyCode);

      if (users.length > 0) {
        return users;
      } else {
        console.warn(`No users found for company code: ${companyCode}`);
        return [];
      }
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      return [];
    }
  }, []);

  // GET TOPICS BY COMPANY CODE
  const fetchTopicsByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.warn("Company code is missing");
      return [];
    }

    try {
      const topics = await GetTopicsByCode(companyCode);

      if (topics && topics.length > 0) {
        return topics;
      } else {
        console.warn(`No topics found for company code: ${companyCode}`);
        return [];
      }
    } catch (error) {
      console.error("Error fetching topics:", error.message);
      return [];
    }
  }, []);

  // COMPANY REGISTRATION
  const handleCompanyRegister = async (formData) => {
    try {
      const response = await registerCompany(formData);
      enqueueSnackbar(response.message || "Registration successful!", {
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // CREATING ELECTION
  const handleCreateElection = async (formData) => {
    try {
      const response = await createElection(formData);
      dispatch({
        type: ActionTypes.CREATE_ELECTION_SUCCESS,
        payload: response.election,
      });
      enqueueSnackbar("Election created successfully!", { variant: "success" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create election";
      dispatch({
        type: ActionTypes.CREATE_ELECTION_ERROR,
        payload: { error: errorMessage },
      });
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // POST A VOTE CANDIDATE

  const postElectionVote = useCallback(async (electionId, candidateId) => {
    try {
      if (!electionId || !candidateId) {
        console.log("Election ID or Candidate ID is missing");
        return;
      }
      const response = await postVote(electionId, candidateId);
      return response;
    } catch (error) {
      console.error("Error voting for candidate:", error);
      throw error;
    }
  }, []);

  // GET ELECTION BY ID
  const getElectionById = useCallback(async (electionId) => {
    try {
      if (!electionId) {
        return { data: [] };
      }
      const response = await getElectionsByTheirId(electionId);
      return response;
    } catch (error) {
      console.error("Error in getElectionById:", error);
      throw error;
    }
  }, []);

  // GET ELECTION BY COMPANY CODE

const getElections = useCallback(async (companyCode) => {
  if (!companyCode) {
    console.warn("Invalid company code provided:", { companyCode });
    return [];
  }

  try {
    const response = await GetUpComingElections(companyCode);

    if (!response.data || response.data.length === 0) {
      console.warn(
        "No elections found for the provided company code:",
        companyCode
      );
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error while fetching elections:", error.message);
    return [];
  }
}, []);


  // GET CANDIDATE BY ID
  const getCandidatesById = useCallback(async (electionId) => {
    try {
      const candidates = await fetchCandidatesById(electionId);

      if (candidates.length > 0) {
        console.info("Candidates successfully retrieved:", candidates);
      } else {
        console.warn(
          "No candidates found for the given election ID:",
          electionId
        );
      }

      return candidates;
    } catch (error) {
      console.error("Error fetching candidates by election ID:", error);
      return [];
    }
  }, []);

  // POST USER REMINDER
  const showFeedbackMessage = (message, type = "info") => {
    setFeedbackMessage({ message, type });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const postUserReminder = async (formData) => {
    dispatch({ type: ActionTypes.REQUEST_REMINDER });

    try {
      const response = await newReminder(formData);
      showFeedbackMessage("Reminder created successfully!", "success");

      dispatch({
        type: ActionTypes.REMINDER_SUCCESS,
        payload: response,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create reminder";
      dispatch({
        type: ActionTypes.REMINDER_ERROR,
        payload: errorMessage,
      });

      showFeedbackMessage(errorMessage, "error");
      throw error;
    }
  };

  const getUserReminder = async ({ userId }) => {
    if (!userId) {
      console.warn("getUserReminder: userId is undefined or null");
      throw new Error("User ID is required to fetch reminders");
    }
    try {
      const reminders = await fetchReminder(userId);
      const feedbackText =
        reminders?.length > 0
          ? "Reminders fetched successfully!"
          : "No reminders found for this user.";

      showFeedbackMessage(
        feedbackText,
        reminders?.length > 0 ? "success" : "info"
      );

      return reminders || [];
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch reminders";
      showFeedbackMessage(errorMessage, "error");
      throw error;
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      const response = await handleDeleteReminder(reminderId);
      showFeedbackMessage("Reminder deleted successfully", "success");
      return response.data;
    } catch (error) {
      console.error("Error deleting reminder:", error);
      showFeedbackMessage("Failed to delete reminder", "error");
      throw error;
    }
  };

  // GET PAST ELECTION
  const fetchPastElection = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is required to fetch past elections.");
      return [];
    }

    try {
      const response = await getPastElections(companyCode);

      if (response && response.length > 0) {
        return response; // Return the fetched elections
      } else {
        return []; // Return an empty array when no elections are found
      }
    } catch (error) {
      console.error("Error in fetchPastElection:", error);
      return []; // Gracefully return an empty array in case of an error
    }
  }, []);

  // POSTING NEW TESTIMONY
  const postTestimony = useCallback(async (testimonyData) => {
    try {
      if (
        !testimonyData.name ||
        !testimonyData.position ||
        !testimonyData.company ||
        !testimonyData.testimony
      ) {
        console.error("Invalid testimony data:", testimonyData);
        return;
      }
      const response = await newTestimonyPosting(testimonyData);
      if (response) {
        console.log("Testimony posted successfully:", response);
      } else {
        console.warn("No response from server");
      }

      return response;
    } catch (error) {
      console.error("Error in postTestimony:", error);
      throw error;
    }
  }, []);

  // CREATE A NEW TOPIC
  const handleCreateTopic = async (topicData) => {
    console.log("Attempting to create topic:", topicData);

    try {
      const user = getStoredUser();
      if (!user) {
        const loginError = "You must be logged in to create a topic.";
        console.error(loginError);
        enqueueSnackbar(loginError, { variant: "error" });
        return;
      }
      const response = await createTopic(topicData);
      dispatch({
        type: ActionTypes.CREATE_TOPIC_SUCCESS,
        payload: response.topic,
      });

      enqueueSnackbar("Topic created successfully!", { variant: "success" });
    } catch (error) {
      handleTopicCreationError(error);
    }
  };

  function handleTopicCreationError(error) {
    const errorMessage =
      error.response?.data?.error || "Failed to create topic.";
    console.error("Error creating topic:", errorMessage);

    dispatch({
      type: ActionTypes.CREATE_TOPIC_ERROR,
      payload: { error: errorMessage },
    });

    enqueueSnackbar(errorMessage, { variant: "error" });
  }

  // CREATING COMPANY NEWS
  const handleCreateCompanyNews = async (newsData) => {
    try {
      const user = getStoredUser();
      if (!user) {
        enqueueSnackbar("You must be logged in to create company news.", {
          variant: "error",
        });
        return;
      }
      const response = await createCompanyNews(newsData);
      if (response.success) {
        enqueueSnackbar("Company news created successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(response.message || "Failed to create company news.", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while creating company news", {
        variant: "error",
      });
    }
  };

  const handleCreateConversation = useCallback(
    async (participantIds, title) => {
      try {
        const conversation = await createConversation(participantIds, title);
        return conversation;
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    },
    []
  );

  // REPLY TO MESSAGE
  const handleReplyMessage = useCallback(async (conversationId, content) => {
    if (!conversationId || !content) {
      console.error("Both conversationId and content are required.");
      return;
    }

    try {
      const messageData = { conversationId, content };
      const response = await replyMessage(messageData);
      return response;
    } catch (error) {
      console.error("Error replying to message:", error);
      throw error;
    }
  }, []);

  // SEND A MESSAGE
  const handleSendMessage = useCallback(async (messageData) => {
    const { recipientId, content } = messageData;

    if (!recipientId || !content) {
      console.error("Recipient ID and content are required.");
      throw new Error("Recipient ID and content are required.");
    }

    try {
      const response = await sendMessage(messageData);
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }, []);

  // Get reminders by user ID
  const fetchReminders = useCallback(async (userId) => {
    try {
      if (!userId) {
        console.warn("User ID is undefined or null");
        return [];
      }
      const reminders = await getReminders(userId);
      return reminders;
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  }, []);

  // Get messages by user ID
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      if (!conversationId) {
        console.warn("Conversation ID is undefined or null");
        return [];
      }
      const messages = await getMessages(conversationId);
      console.info("Fetched messages:", messages);
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }, []);

  // GET ALL INBOX MESSAGES
  const fetchInboxMessages = useCallback(
    async (conversationId) => {
      if (!conversationId) {
        setError("Conversation ID not found.");
        console.error("Conversation ID is missing.");
        return [];
      }

      console.log("Fetching messages for conversation ID:", conversationId);

      try {
        setLoading(true);
        const { conversations, messages } = await getConversations();

        if (!conversations.length) {
          setError("No conversations found.");
          console.warn("No conversations returned from the server.");
          setLoading(false);
          return [];
        }

        const conversationMessages = messages.filter(
          (msg) => msg.conversation === conversationId
        );

        console.log(
          "Filtered messages for conversation:",
          conversationMessages
        );

        if (conversationMessages.length > 0) {
          return conversationMessages;
        } else {
          setError("No messages found for this conversation.");
          console.warn(
            "No messages found for conversation ID:",
            conversationId
          );
          return [];
        }
      } catch (error) {
        setError("Failed to load messages.");
        console.error("Error fetching inbox messages:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getConversations]
  );

  // GET SENT MESSAGE
  const getSentMessages = useCallback(async () => {
    try {
      const messages = await fetchSentMessages();
      if (!messages || messages.length === 0) {
        console.warn("No sent messages found.");
        return [];
      }
      return messages;
    } catch (error) {
      console.error("Error fetching sent messages:", error);
      return [];
    }
  }, []);

  // UPDATE ADMIN ROLE AND ELECTION VOTING LIKES
  const updateRoleToAdmin = async (userId) => {
    try {
      const user = await fetchUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const newRole = user.role === "Admin" ? "User" : "Admin";

      await updateUserRole(userId, newRole);

      enqueueSnackbar(`User role updated to ${newRole} successfully!`, {
        variant: "success",
      });

      dispatch({
        type: ActionTypes.UPDATE_ROLE_SUCCESS,
        payload: { userId, role: newRole },
      });
    } catch (error) {
      console.error("Error in updating role:", error);
      enqueueSnackbar(
        error.message || "Failed to update user role. Please try again.",
        { variant: "error" }
      );
    }
  };

  // UPDATE PROFILE LIKES
  const updateProfileLike = async (userId) => {
    try {
      const response = await updateUserProfileLike(userId);
      enqueueSnackbar(response.message || "Profile liked successfully!", {
        variant: "success",
      });
      dispatch({
        type: ActionTypes.UPDATE_LIKES_SUCCESS,
        payload: { userId, likesCount: response.profileLikes },
      });
    } catch (error) {
      console.error("Error updating profile like:", error);
      enqueueSnackbar(
        error.message || "Failed to update like count. Please try again.",
        { variant: "error" }
      );
    }
  };

  // NEW NEWS INDICATOR
  const updateReadNewNews = async (newsId, userId, enqueueSnackbar) => {
    try {
      const response = await newsReading(newsId, userId);
      enqueueSnackbar(response.message || "News marked as read successfully!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error.message || "Failed to mark news as read. Please try again.",
        { variant: "error" }
      );
    }
  };

  // MARK NEWS ARE READ
const markAsReadNews = async (newsId) => {
  try {
    const response = await MarkNewsAsReading(newsId);
    if (response?.success) {
      console.log(
        "[INFO] Successfully marked news as read:",
        response.newsItem
      );
      return { success: true, newsItem: response.newsItem };
    } else {
      console.warn("[WARN] Failed to mark news as read on the server.");
      return {
        success: false,
        message: response?.message || "Failed to mark as read.",
      };
    }
  } catch (error) {
    const errorMessage =
      error.message || "Unexpected error marking news as read.";
    console.error("[ERROR] Error in markAsReadNews:", errorMessage);
    return { success: false, message: errorMessage };
  }
};





  // GET NEWS BY COMPNAY CODE
const getCompanyNews = async (companyCode) => {
  try {
    const response = await GetUpComingNews(companyCode); // Calls the GetUpComingNews function directly
    if (response?.news?.length > 0) {
      return response; // Returns response with news array if available
    } else {
      console.warn("[WARN] No news items found in getCompanyNews.");
      return { news: [], message: response?.message || "No news available." };
    }
  } catch (error) {
    console.error("[ERROR] Error in getCompanyNews:", error.message);
    return { news: [], message: "Error fetching company news." };
  }
};




  const showMessage = (message, type = "info") => {
    setFeedbackMessage({ message, type });
    setTimeout(() => setFeedbackMessage(null), 3000); // Clear after 3 seconds
  };

  const updateTopicVote = useCallback(async (userId, topicId, action) => {
    dispatch({ type: ActionTypes.UPDATE_VOTE_REQUEST });

    try {
      const response = await apiUpdateTopicVote(userId, topicId, action);
      showMessage(
        response.message || "Vote registered successfully!",
        "success"
      );

      dispatch({
        type: ActionTypes.UPDATE_VOTE_SUCCESS,
        payload: {
          topicId,
          likesCount: response.likesCount,
          dislikesCount: response.dislikesCount,
        },
      });

      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        `Failed to process your ${action}. Please try again.`;

      showMessage(errorMessage, "error");

      dispatch({
        type: ActionTypes.UPDATE_VOTE_ERROR,
        payload: { error: errorMessage },
      });

      throw error;
    }
  }, []);

const fetchLikesAndDislikes = async (topicId, action) => {
  try {
    const response = await getReactionsNow(topicId, action);
    const count =
      action === "likes" ? response.likesCount : response.dislikesCount;

    if (count !== undefined) {

      showMessage(
        response.message || `Successfully fetched ${action}.`,
        "success"
      );
      return { count, users: response[action] };
    } else {
      console.error(`Invalid response for ${action}: count is missing.`);
      throw new Error(`Invalid response for ${action}: count is missing.`);
    }
  } catch (error) {
    console.error(
      `Error fetching ${action} for topic ID ${topicId}:`,
      error.message
    );
    showMessage(
      error.message || `Failed to fetch ${action}. Please try again.`,
      "error"
    );
  }
};



  const addCommentToTopic = useCallback(
    async (userId, topicId, comment) => {
      dispatch({ type: ActionTypes.ADD_COMMENT_REQUEST });

      try {
        const response = await postComment({ userId, topicId, comment });
        dispatch({
          type: ActionTypes.ADD_COMMENT_SUCCESS,
          payload: response.comments,
        });
        showMessage("Comment added successfully!", "success");
        return response.comments;
      } catch (error) {
        dispatch({
          type: ActionTypes.ADD_COMMENT_ERROR,
          payload: error.response?.data?.error || "Failed to add comment",
        });
        showMessage("Failed to add comment. Please try again.", "error");
        throw error;
      }
    },
    [dispatch]
  );

  // const updateTopicVote = useCallback(
  //   async (userId, topicId, action) => {
  //     dispatch({ type: ActionTypes.UPDATE_VOTE_REQUEST });

  //     try {
  //       const response = await apiUpdateTopicVote(userId, topicId, action);

  //       enqueueSnackbar(response.message || "Vote registered successfully!", {
  //         variant: "success",
  //       });

  //       dispatch({
  //         type: ActionTypes.UPDATE_VOTE_SUCCESS,
  //         payload: {
  //           topicId,
  //           likesCount: response.likesCount,
  //           dislikesCount: response.dislikesCount,
  //         },
  //       });

  //       return response;
  //     } catch (error) {
  //       const errorMessage =
  //         error.response?.data?.error ||
  //         `Failed to process your ${action}. Please try again.`;

  //       enqueueSnackbar(errorMessage, { variant: "error" });

  //       dispatch({
  //         type: ActionTypes.UPDATE_VOTE_ERROR,
  //         payload: { error: errorMessage },
  //       });

  //       throw error;
  //     }
  //   },
  //   [enqueueSnackbar]
  // );

  // const fetchLikesAndDislikes = async (topicId, action, enqueueSnackbar) => {
  //   try {

  //     const response = await getReactionsNow(topicId, action);
  //     const count =
  //       action === "likes" ? response.likesCount : response.dislikesCount;

  //     if (count !== undefined) {
  //       enqueueSnackbar(response.message || `Successfully fetched ${action}.`, {
  //         variant: "success",
  //       });
  //       return { count, users: response[action] };
  //     } else {
  //       throw new Error(`Invalid response for ${action}: count is missing.`);
  //     }
  //   } catch (error) {
  //     console.error(`Error fetching ${action}:`, error.message);
  //     enqueueSnackbar(
  //       error.message || `Failed to fetch ${action}. Please try again.`,
  //       { variant: "error" }
  //     );
  //   }
  // };

  // const addCommentToTopic = useCallback(
  //   async (userId, topicId, comment) => {
  //     dispatch({ type: ActionTypes.ADD_COMMENT_REQUEST });

  //     try {
  //       const response = await postComment({
  //         userId,
  //         topicId,
  //         comment,
  //       });

  //       dispatch({
  //         type: ActionTypes.ADD_COMMENT_SUCCESS,
  //         payload: response.comments,
  //       });

  //       enqueueSnackbar("Comment added successfully!", { variant: "success" });
  //       return response.comments;
  //     } catch (error) {
  //       dispatch({
  //         type: ActionTypes.ADD_COMMENT_ERROR,
  //         payload: error.response?.data?.error || "Failed to add comment",
  //       });
  //       enqueueSnackbar("Failed to add comment. Please try again.", {
  //         variant: "error",
  //       });
  //       throw error;
  //     }
  //   },
  //   [dispatch, enqueueSnackbar]
  // );

  const contextValue = useMemo(() => {
    const {
      user,
      electionCreated,
      electionError,
      isElectionSaved,

      saveElectionError,
    } = state;

    return {
      user: state.user,
      userId: state.user?._id,
      authChecking: state.authChecking,

      isAuthenticated: !!state.user,
      handleRegister,
      fetchMessages,
      postElectionVote,
      handleReplyMessage,
      fetchInboxMessages,
      handleSendMessage,
      handleLogout,
      handleLogin,
      getElections,
      getSentMessages,
      getCompanyNews,
      fetchUserById,
      handleCreateElection,
      updateReadNewNews,
      fetchTopicsByCompanyCode,
      fetchUserByCompanyCode,
      handleCompanyRegister,
      enqueueSnackbar,
      handleCreateTopic,
      handleCreateCompanyNews,
      getElectionById,
      updateTopicVote,
      fetchAdminUsers,
      fetchPastElection,
      fetchLikesAndDislikes,
      postTestimony,
      getUserReminder,
      postUserReminder,
      deleteReminder,
      getCandidatesById,
      markAsReadNews,
      fetchSentMessages,
      updateRoleToAdmin,
      updateProfileLike,
      addCommentToTopic,
      handleCreateTopic,
      electionCreated,
      electionError,
      isElectionSaved,
      saveElectionError,
    };
  }, [
    state,
    handleCreateTopic,
    enqueueSnackbar,
    fetchInboxMessages,
    getSentMessages,
    handleReplyMessage,
    getCandidatesById,
    handleCompanyRegister,
    postElectionVote,
    handleLogout,
    handleLogin,
    updateReadNewNews,
    getElections,
    getCompanyNews,
    updateRoleToAdmin,
    fetchUserById,
    handleRegister,
    markAsReadNews,
    handleCreateElection,
    fetchTopicsByCompanyCode,
    fetchUserByCompanyCode,
    handleCreateTopic,
    handleCreateCompanyNews,
    getElectionById,
    updateRoleToAdmin,
    updateProfileLike,
    updateTopicVote,
    fetchAdminUsers,
    fetchPastElection,
    postTestimony,
    getUserReminder,
    fetchLikesAndDislikes,
    postUserReminder,
    deleteReminder,
    fetchMessages,
    handleSendMessage,
    updateUserProfileLike,
    handleCreateConversation,
    addCommentToTopic,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);