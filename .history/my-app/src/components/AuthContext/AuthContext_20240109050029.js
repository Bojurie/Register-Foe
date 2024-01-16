import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from "react";
import { useDispatch } from "react-redux"; 
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import {
  login,
  registerUser,
  registerCompany,
  saveElection,
  createElection,
  GetTopicsByCode,
  getUsersByCompanyCode,
  createTopic,
  GetUpComingElections,
   getUserById,
  getAdminUsers,
  getElectionsByTheirId,
  updateUserRoleToAdmin,
} from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";
import { validateToken } from "../../AuthService/validateToken";

export const AuthContext = createContext();

const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
  CREATE_ELECTION_SUCCESS: "CREATE_ELECTION_SUCCESS",
  CREATE_ELECTION_ERROR: "CREATE_ELECTION_ERROR",
};

// Simplify reducer cases
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

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true, // Add a loading state
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function checkAuthentication() {
      const token = getStoredToken();
      if (!token) {
        handleUnauthenticatedUser();
        return;
      }
      const isValidToken = await validateToken();
      if (!isValidToken) {
        handleUnauthenticatedUser();
        return;
      }
      const storedUser = getStoredUser();
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: storedUser },
      });
    }
    function handleUnauthenticatedUser() {
      removeStoredUser();
      removeStoredToken();
      navigate("/login");
      dispatch({ type: ActionTypes.SET_LOADING, payload: { loading: false } });
    }
    checkAuthentication();
  }, [navigate, dispatch]);

  const processLoginResponse = useCallback(
    (response) => {
      setStoredToken(response.token);
      setStoredUser({
        id: response.user._id,
        isCompany: response.user.isCompany,
        firstName: response.user.firstName,
        companyName: response.user.companyName,
        lastName: response.user.lastName,
        companyCode: response.user.companyCode,
        createdBy: response.user._id,
      });

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: response.user },
      });
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/main");
    },
    [navigate, enqueueSnackbar, dispatch]
  );

  const handleLogin = useCallback(
    async (formData) => {
      try {
        const response = await login(formData);
        processLoginResponse(response);
      } catch (error) {
        handleLoginError(error);
      }
    },
    [processLoginResponse]
  );

  function handleLoginError(error) {
    const errorMessage =
      error.response?.data?.error || "Login failed. Please try again.";
    enqueueSnackbar(errorMessage, { variant: "error" });
  }

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

  const fetchAdminUsers = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is undefined or null");
      return [];
    }
    try {
      const response = await getAdminUsers(companyCode);
      return response.data;
    } catch (error) {
      console.error("Error fetching users by company code:", error);
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

  // Assuming getUserById is a function that fetches a single user by ID
  const fetchUserById = useCallback(
    async (userId) => {
      try {
        const response = await getUserById(userId);
        return response.data;
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
      }
    },
    [getUserById]
  );

  const fetchTopicsByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.log(
        "fetchTopicsByCompanyCode received companyCode:",
        companyCode
      );
      return { data: [] };
    }
    try {
      const response = await GetTopicsByCode(companyCode);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const useHandleRegister = () => {
    const dispatch = useDispatch();
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
      console.log(error);
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

  const getElections = useCallback(async (companyCode) => {
    try {
      if (!companyCode) {
        console.log("ElectionbyCompanyCode received companyCode:", companyCode);
        return { data: [] };
      }
      const response = await GetUpComingElections(companyCode);
      return response;
    } catch (error) {
      console.error("Error in getElections:", error);
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
        return; // Early return if user is not logged in
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

  const handleSaveElection = async (electionData) => {
    try {
      const response = await saveElection(electionData);
      dispatch(
        response.success
          ? { type: ActionTypes.SAVE_ELECTION_SUCCESS }
          : {
              type: ActionTypes.SAVE_ELECTION_ERROR,
              payload: { error: "Failed to save election" },
            }
      );
      enqueueSnackbar(
        response.success
          ? "Election saved successfully!"
          : "Failed to save election",
        { variant: response.success ? "success" : "error" }
      );
    } catch (error) {
      dispatch({
        type: ActionTypes.SAVE_ELECTION_ERROR,
        payload: { error: error.message },
      });
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const contextValue = useMemo(
    () => ({
      user: state.user,
      isAuthenticated: !!state.user,
      handleLogout,
      handleLogin,
      handleSaveElection,
      getElections,
      fetchUserById,
      handleCreateElection,
      fetchTopicsByCompanyCode,
      fetchUserByCompanyCode,
      useHandleRegister,
      handleCompanyRegister,
      enqueueSnackbar,
      handleCreateTopic,
      getElectionById,
      updateRoleToAdmin,
      fetchAdminUsers,
      electionCreated: state.electionCreated,
      electionError: state.electionError,
      isElectionSaved: state.isElectionSaved,
      saveElectionError: state.saveElectionError,
    }),
    [state, handleLogout, handleLogin]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
