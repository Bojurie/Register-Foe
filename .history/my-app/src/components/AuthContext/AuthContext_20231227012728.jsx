import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useDispatch } from "react-redux"; // Add this import
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
  GetUsersByCode,
  createTopic,
} from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

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
  const [state, dispatch] = useReducer(authReducer, { user: getStoredUser() });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: storedUser },
      });
    }

    const token = getStoredToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [dispatch]);

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

const useHandleLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  return useCallback(
    async (formData) => {
      try {
        const response = await login(formData);
        console.log("Login response data:", response);
        if (!response.token) {
          console.error("Login failed: Token is missing.");
          enqueueSnackbar("Login failed: Token is missing.", {
            variant: "error",
          });
          return;
        }
        const { token, user, isCompany } = response;
        const userData = { ...user, isCompany: !!isCompany };

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
console.log(token)
        setStoredToken(token);
        setStoredUser(userData);
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user: userData },
        });
        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/main");
      } catch (error) {
        console.error("Login error:", error);
        if (error.response) {
          console.error(
            "Server responded with:",
            error.response.status,
            error.response.data
          );
          const errorMessage =
            error.response?.data?.error || "Login failed. Please try again.";
          enqueueSnackbar(errorMessage, { variant: "error" });
        } else if (error.request) {
          console.error("No response received:", error.request);
          enqueueSnackbar(
            "Network error. Please check your internet connection.",
            {
              variant: "error",
            }
          );
        } else {
          console.error("An error occurred:", error);
          enqueueSnackbar("An error occurred. Please try again later.", {
            variant: "error",
          });
        }
      }
    },
    [navigate, dispatch, enqueueSnackbar]
  );
};

  const { enqueueSnackbar } = useSnackbar();

  const fetchUserByCompanyCode = async (companyCode) => {
    try {
      const response = await GetUsersByCode(companyCode);
      return response.data;
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  };

  const fetchTopicsByCompanyCode = async (companyCode) => {
    try {
      const response = await GetTopicsByCode(companyCode);
      return response.data;
    } catch (error) {
      console.error("Error fetching topics:", error);
      throw error;
    }
  };

  const handleRegister = async (formData) => {
    try {
      const response = await registerUser(formData);
      console.log(response.data);
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

  const handleCreateElection = async (electionData) => {
    try {
      const user = getStoredUser();
      if (!user || !user.token) {
        throw new Error("You must be logged in to create an election.");
      }
      await createElection(electionData);
      // Success action and message handling...
    } catch (error) {
      // Error action and message handling...
    }
  };

  const handleCreateTopic = async (topicData) => {
    try {
      const user = getStoredUser();
      if (!user || !user.token) {
        throw new Error("You must be logged in to create a topic.");
      }
      const response = await createTopic(topicData);

      // Dispatch success action and show success message
      dispatch({ type: ActionTypes.CREATE_TOPIC_SUCCESS });
      enqueueSnackbar("Topic created successfully!", { variant: "success" });
    } catch (error) {
      // Dispatch error action and show error message
      dispatch({
        type: ActionTypes.CREATE_TOPIC_ERROR,
        payload: { error: error.message },
      });
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

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

  const contextValue = {
    user: state.user,
    // handleLogin,
    handleLogout,
    handleRegister,
    handleSaveElection,
    handleCreateElection,
    fetchTopicsByCompanyCode,
    fetchUserByCompanyCode,
    handleCompanyRegister,
    enqueueSnackbar,
    handleCreateTopic,
    useHandleLogin,
    electionCreated: state.electionCreated,
    electionError: state.electionError,
    isElectionSaved: state.isElectionSaved,
    saveElectionError: state.saveElectionError,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
