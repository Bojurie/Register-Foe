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
  updateUserProfileLike,
  createCompanyNews,
  getAdminUsers,
  getElectionsByTheirId,
  updateUserRoleToAdmin,
  getPastElections,
  getSavedElections,
  topicLike,
  dislikeTopicLike,
  fetchCandidatesById,
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
      return { ...state, user: action.payload.user };
    case ActionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user };
    case ActionTypes.LOGOUT:
      return { ...state, user: null };
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
    console.log("Starting authentication check");
    const token = getStoredToken();

    if (!token) {
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user: null } });
      return;
    }

    const isValidToken = await validateToken(token);

    if (!isValidToken) {
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user: null } });
      return;
    }

    const user = getStoredUser();
    console.log("User retrieved from storage:", user);
    dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
  }, [dispatch]);

  useEffect(() => {
    handleAuthentication();
  }, [handleAuthentication]);

  const handleLogin = useCallback(
    async (formData) => {
      console.log("Logging in...");
      try {
        const { token, user } = await login(formData);
        console.log("Received user in handleLogin:", user);
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
      const admins = await getAdminUsers(companyCode);
      return admins;
    } catch (error) {
      console.error("Error fetching admin users:", error.message);
      return [];
    }
  }, []);

  const fetchUserByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is undefined or null");
      return { data: [] };
    }
    try {
      const response = await getUsersByCompanyCode(companyCode);
      return response;
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      return { data: [] };
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

  const getCandidatesById = useCallback(async (electionId) => {
    try {
      const candidates = await fetchCandidatesById(electionId);
      return candidates;
    } catch (error) {
    console.error("Error fetching candidates by election ID:", error);
      return null;
    }
  }, []);




  const fetchTopicsByCompanyCode = useCallback(async (companyCode) => {
    try {
      if (!companyCode) {
        console.log("fetchTopicsByCompanyCode: Company code is missing");
        return { data: [] };
      }

      const response = await GetTopicsByCode(companyCode);
      console.log("fetchTopicsByCompanyCode response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  }, []);

  const useHandleRegister = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleRegister = async (formData) => {
      try {
        const response = await registerUser(formData);
        enqueueSnackbar("Registration successful!", { variant: "success" });
        dispatch({
          type: ActionTypes.REGISTER_SUCCESS,
          payload: { user: response.data.user },
        });
      } catch (error) {
        let errorMessage = "Registration failed. Please try again.";
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }
        enqueueSnackbar(errorMessage, { variant: "error" });
        dispatch({
          type: ActionTypes.REGISTER_ERROR,
          payload: { error: errorMessage },
        });
      }
    };

    return handleRegister;
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

  const updateRoleToAdmin = async (userId) => {
    try {
      const response = await updateUserRoleToAdmin(userId, "Admin");
      enqueueSnackbar(response.message || "User role updated successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to update user role. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      dispatch({
        type: ActionTypes.UPDATE_ROLE_ERROR,
        payload: { error: errorMessage },
      });
    }
  };

  const updateProfileLike = async (userId, electionId) => {
    try {
      const response = await updateUserProfileLike(userId, electionId);
      enqueueSnackbar(response.message || "Thank you for your vote!", {
        variant: "success",
      });
      return response;
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error ||
        "Failed to update user role. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
      dispatch({
        type: ActionTypes.UPDATE_ROLE_ERROR,
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
    try {
      const response = await fetchReminder(userId);
      console.log("User Reminder Data:", response);
      enqueueSnackbar("Reminder fetched successfully!", { variant: "success" });
      return response;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch reminders";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    }
  };

const getElections = useCallback(async (electionId) => {
  try {
    if (!electionId) {
      console.log("Election by ID received electionId:", electionId);
      return null; 
    }
    const election = await GetUpComingElections(electionId);
    return election;
  } catch (error) {
    console.error("Error in getElections:", error);
    throw error;
  }
}, []);

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
        return { savedElections: [] };
      }
      const response = await getSavedElections(userId);
      console.log(response);
      return { savedElections: response };
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

  const getElectionById = useCallback(async (companyCode, electionId) => {
    try {
      if (!companyCode) {
        console.log("getElectionById received companyCode:", companyCode);
        return { data: [] };
      }
      const response = await getElectionsByTheirId(companyCode, electionId);
      console.log("API Response in getElectionById:", response);
      return response;
    } catch (error) {
      console.error("Error in getElectionById:", error);
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

  const contextValue = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: !!state.user,
      handleLogout,
      handleLogin,
      handleSaveElection,
      getElections,
      getCompanyNews,
      fetchUserById,
      handleCreateElection,
      fetchTopicsByCompanyCode,
      fetchUserByCompanyCode,
      useHandleRegister,
      handleCompanyRegister,
      enqueueSnackbar,
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
      getCandidatesById,
      electionCreated: state.electionCreated,
      electionError: state.electionError,
      isElectionSaved: state.isElectionSaved,
      saveElectionError: state.saveElectionError,
    }),
    [
      state,
      handleLogout,
      handleLogin,
      handleSaveElection,
      getElections,
      getCompanyNews,
      fetchUserById,
      handleCreateElection,
      fetchTopicsByCompanyCode,
      fetchUserByCompanyCode,
      useHandleRegister,
      handleCompanyRegister,
      enqueueSnackbar,
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
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
