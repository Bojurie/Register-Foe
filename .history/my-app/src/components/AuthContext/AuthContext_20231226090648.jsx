import React, { createContext, useReducer, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStoredUser,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";
import useHandleLogin from "../useHandleLogin";
import useHandleLogout from "../useHandleLogout"
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
import { ActionTypes } from "../ActionTypes/ActionTypes";
import { enqueueSnackbar } from "notistack";
import { authReducer } from "../authReducer/authReducer";
// import authReducer from "../authReducer/authReducer";
// import useHandleLogin from "../useHandleLogin.js";

export const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: getStoredUser() });
  const navigate = useNavigate();
  const handleLogin = useHandleLogin();
  const handleLogout = useHandleLogout();

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
    handleLogin,
    handleLogout,
    handleRegister,
    handleSaveElection,
    handleCreateElection,
    fetchTopicsByCompanyCode,
    fetchUserByCompanyCode,
    handleCompanyRegister,
    enqueueSnackbar,
    handleCreateTopic,
    useLogin: () => useHandleLogin(dispatch, navigate, enqueueSnackbar),
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
