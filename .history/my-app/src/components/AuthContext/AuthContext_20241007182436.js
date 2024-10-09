import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { validateToken } from "../../AuthService/validateToken";
import {
  registerUser,
  registerCompany,
  fetchReminder,
  newReminder,
  saveElection,
  createElection,
  GetTopicsByCode,
  getUsersByCompanyCode,
  createTopic,
  GetUpComingElections,
  GetUpComingNews,
  getUserById,
  handleDeleteReminder,
  login,
  postVote,
  updateUserProfileLike,
  createCompanyNews,
  getAdminUsers,
  getElectionsByTheirId,
  updateUserRole,
  getPastElections,
  getSavedElections,
  topicLike,
  dislikeTopicLike,
  getMessages,
  fetchCandidatesById,
  createConversation,
  sendMessage,
  getReminders,
  getConversations,
  getConversationMessages,
  fetchSentMessages,
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
  UPDATE_ROLE_SUCCESS: "UPDATE_ROLE_SUCCESS",
  UPDATE_LIKES_SUCCESS: "UPDATE_LIKES_SUCCESS",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
  CREATE_ELECTION_SUCCESS: "CREATE_ELECTION_SUCCESS",
  CREATE_ELECTION_ERROR: "CREATE_ELECTION_ERROR",
  CREATE_COMPANY_NEWS_SUCCESS: "CREATE_COMPANY_NEWS_SUCCESS",
  CREATE_COMPANY_NEWS_ERROR: "CREATE_COMPANY_NEWS_ERROR",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
      return { ...state, user: action.payload.user, loading: false };
    case ActionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user };
    case ActionTypes.UPDATE_ROLE_SUCCESS:
      return {
        ...state,
        user:
          state.user?._id === action.payload.userId
            ? { ...state.user, role: action.payload.role }
            : state.user,
      };
    case ActionTypes.UPDATE_LIKES_SUCCESS:
      return {
        ...state,
        user:
          state.user?._id === action.payload.userId
            ? { ...state.user, likesCount: action.payload.likesCount }
            : state.user,
      };
    case ActionTypes.LOGOUT:
      return { ...state, user: null, loading: false };
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
    default:
      return state;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    electionCreated: false,
    electionError: null,
    isElectionSaved: false,
    saveElectionError: null,
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleAuthentication = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      dispatch({ type: ActionTypes.LOGOUT });
      return;
    }

    const isValidToken = await validateToken(token);

    if (!isValidToken) {
      dispatch({ type: ActionTypes.LOGOUT });
      return;
    }

    const user = getStoredUser();
    if (!user || !user._id) {
      console.error("User ID is missing or invalid in local storage");
      dispatch({ type: ActionTypes.LOGOUT });
      return;
    }

    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
  }, [dispatch]);

  useEffect(() => {
    handleAuthentication();
  }, [handleAuthentication]);

  const handleLogin = useCallback(
    async (formData) => {
      try {
        const { token, user } = await login(formData);
        if (!user._id) {
          throw new Error("User ID is missing in response");
        }
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

  const handleLogout = useCallback(() => {
    removeStoredToken();
    removeStoredUser();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  }, [navigate, dispatch]);

  const fetchAdminUsers = useCallback(async (companyCode) => {
    try {
      if (!companyCode) {
        console.error("Company code is undefined or null");
        return [];
      }
      const response = await getAdminUsers(companyCode);
      const admins = response;
      console.log("Admin users fetched:", admins);
      return admins;
    } catch (error) {
      console.error("Error fetching admin users:", error.message);
      return [];
    }
  }, []);

  const fetchUserByCompanyCode = useCallback(async (companyCode) => {
    try {
      if (!companyCode) {
        console.error("Company code is undefined or null");
        return [];
      }
      const response = await getUsersByCompanyCode(companyCode);
      return response;
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      return [];
    }
  }, []);

  const fetchUserById = useCallback(async (userId) => {
    try {
      const userDetails = await getUserById(userId);
      return userDetails;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }, []);

  const fetchTopicsByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.warn("Company code is missing");
      return [];
    }

    try {
      console.log("Attempting to fetch topics for company code:", companyCode);
      const topics = await GetTopicsByCode(companyCode);
      console.info("Fetched topics:", topics);
      return topics;
    } catch (error) {
      console.error("Error fetching topics:", error);
      return [];
    }
  }, []);

  // USER REGISTER
  const handleRegister = async (formData) => {
    try {
      const dataToSend = new FormData();

      for (let key in formData) {
        console.log(`Appending key: ${key}, value: ${formData[key]}`);
        dataToSend.append(key, formData[key]);
      }

      console.log("Data to send:", dataToSend);

      const response = await registerUser(dataToSend);
      enqueueSnackbar("Registration successful!", { variant: "success" });
      dispatch({
        type: ActionTypes.REGISTER_SUCCESS,
        payload: { user: response.user || response.company },
      });
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      if (error?.message) {
        errorMessage = error.message;
      }
      console.error("Registration Error:", error);
      enqueueSnackbar(errorMessage, { variant: "error" });
      dispatch({
        type: ActionTypes.REGISTER_ERROR,
        payload: { error: errorMessage },
      });
    }
  };

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
      dispatch({
        type: ActionTypes.REGISTER_ERROR,
        payload: { error: errorMessage },
      });
    }
  };

  const updateTopicVote = async (userId, topicId, action) => {
    let response;
    try {
      if (action === "like") {
        response = await topicLike(userId, topicId);
      } else if (action === "dislike") {
        response = await dislikeTopicLike(userId, topicId);
      } else {
        throw new Error("Invalid action specified.");
      }

      enqueueSnackbar(response.message || "Thank you for your vote!", {
        variant: "success",
      });
      return response;
    } catch (error) {
      console.error("Error updating topic vote:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to process your vote. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      dispatch({
        type: ActionTypes.UPDATE_VOTE_ERROR,
        payload: { error: errorMessage },
      });
    }
  };

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

  const postUserReminder = async (formData) => {
    try {
      const response = await newReminder(formData);
      enqueueSnackbar("Reminder created successfully!", { variant: "success" });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to create reminder";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
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
        console.log("getElectionById received ", electionId);
        return { data: [] };
      }
      const response = await getElectionsByTheirId(electionId);
      console.log("API Response in getElectionById:", response);
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
      return null;
    }

    try {
      const elections = await GetUpComingElections(companyCode);

      if (!elections || !elections.length) {
        console.warn(
          "No elections found for the provided company code:",
          companyCode
        );
        return null;
      }

      console.info("Elections successfully retrieved:", elections);
      return elections;
    } catch (error) {
      console.error("Error while fetching elections:", error.message);
      return null;
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

  const deleteReminder = async (reminderId) => {
    try {
      const response = await handleDeleteReminder(reminderId);
      return response.data;
    } catch (error) {
      console.error("Error deleting reminder:", error);
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
      if (reminders && reminders.length > 0) {
        enqueueSnackbar("Reminders fetched successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar("No reminders found for this user.", {
          variant: "info",
        });
      }

      return reminders;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch reminders";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    }
  };

  const fetchPastElection = useCallback(async (userId) => {
    try {
      if (!userId) {
        console.log("User ID is undefined or null");
        return { data: [] };
      }
      const response = await getPastElections(userId);
      return response;
    } catch (error) {
      console.error("Error in fetchPastElection:", error);
      throw error;
    }
  }, []);

  const fetchSavedElections = useCallback(async (userId) => {
    try {
      if (!userId) {
        console.log("Invalid user ID:", userId);
        return [];
      }
      const response = await getSavedElections(userId);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error in fetchSavedElections:", error);
      throw error;
    }
  }, []);

  const getCompanyNews = useCallback(async (companyCode) => {
    try {
      if (!companyCode) {
        console.log("getCompanyNews received empty companyCode");
        return { data: [] };
      }
      const response = await GetUpComingNews(companyCode);
      return response;
    } catch (error) {
      console.error("Error in getCompanyNews:", error);
      throw error;
    }
  }, []);

  const handleCreateTopic = async (topicData) => {
    try {
      const user = getStoredUser();
      if (!user) {
        enqueueSnackbar("You must be logged in to create a topic.", {
          variant: "error",
        });
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
    dispatch({
      type: ActionTypes.CREATE_TOPIC_ERROR,
      payload: { error: errorMessage },
    });
    enqueueSnackbar(errorMessage, { variant: "error" });
  }

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

  const handleSaveElection = useCallback(
    async (electionId) => {
      try {
        const response = await saveElection(electionId);

        if (response.success) {
          dispatch({
            type: ActionTypes.SAVE_ELECTION_SUCCESS,
            payload: { user: response.user },
          });
          enqueueSnackbar("Elections saved successfully!", {
            variant: "success",
          });
        } else {
          const errorMessage =
            response.error ||
            "An unknown error occurred while saving elections";

          dispatch({
            type: ActionTypes.SAVE_ELECTION_ERROR,
            payload: { error: errorMessage },
          });

          enqueueSnackbar(errorMessage, {
            variant: "error",
          });
        }
      } catch (error) {
        const errorMessage =
          error.message || "An error occurred while saving the elections";

        dispatch({
          type: ActionTypes.SAVE_ELECTION_ERROR,
          payload: { error: errorMessage },
        });

        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, dispatch]
  );

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

  // Send a new message
  const handleSendMessage = useCallback(
    async (conversationId, recipientId, content) => {
      try {
        const messageData = {
          conversationId,
          recipientId, 
          content,
        };
        const message = await sendMessage(messageData);
        return message;
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    []
  );


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

  // Get all conversations for a user
  const fetchInboxMessages = useCallback(async () => {
    try {
      const conversations = await getConversations();
      return conversations;
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  const getSentMessages = useCallback(async () => {
    try {
      const conversations = await fetchSentMessages();
      return conversations;
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  // Get all messages in a conversation
  const fetchConversationMessages = useCallback(async (conversationId) => {
    try {
      if (!conversationId) {
        console.warn("Conversation ID is required");
        return [];
      }
      const messages = await getConversationMessages(conversationId);
      return messages;
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
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
      isAuthenticated: !!state.user,
      handleRegister,
      fetchMessages,
      postElectionVote,
      fetchInboxMessages,
      handleSendMessage,
      fetchConversationMessages,
      handleLogout,
      handleLogin,
      handleSaveElection,
      getElections,
      getCompanyNews,
      fetchUserById,
      handleCreateElection,
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
      fetchSavedElections,
      getUserReminder,
      postUserReminder,
      deleteReminder,
      getCandidatesById,
      fetchSentMessages,
      updateRoleToAdmin,
      updateProfileLike,

      // State properties
      electionCreated,
      electionError,
      isElectionSaved,
      saveElectionError,
    };
  }, [
    state,
    enqueueSnackbar,
    fetchInboxMessages,
    getCandidatesById,
    handleCompanyRegister,
    postElectionVote,
    handleLogout,
    handleLogin,
    handleSaveElection,
    getElections,
    getCompanyNews,
    updateRoleToAdmin,
    fetchUserById,
    handleRegister,
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
    fetchSavedElections,
    getUserReminder,
    postUserReminder,
    deleteReminder,
    fetchMessages,
    handleSendMessage,updateUserProfileLike,
    handleCreateConversation,
    fetchConversationMessages,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);