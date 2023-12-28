// import React, {
//   createContext,
//   useEffect,
//   useReducer,
//   useContext,
//   useCallback,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSnackbar } from "notistack";
// import {
//   login,
//   registerUser,
//   registerCompany,
//   saveElection,
// } from "../AuthAPI/AuthAPI";

// import {
//   getStoredUser,
//   removeStoredUser,
//   removeStoredToken,
// } from "../LocalStorageManager/LocalStorageManager";


import React, { createContext, useReducer, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  login,
  registerUser,
  registerCompany,
  saveElection,
} from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
} from "../LocalStorageManager/LocalStorageManager";


export const AuthContext = createContext();

const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  COMPANY_LOGIN_SUCCESS: "COMPANY_LOGIN_SUCCESS",
  COMPANY_REGISTER_SUCCESS: "COMPANY_REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.REGISTER_SUCCESS:
    case ActionTypes.COMPANY_LOGIN_SUCCESS:
    case ActionTypes.COMPANY_REGISTER_SUCCESS:
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
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: storedUser },
      });
      // No need to enqueueSnackbar and navigate here since user is already logged in
    }
  }, []);

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

  const handleLogin = useCallback(
    async (formData) => {
      try {
        const response = await login(formData);
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user: response.user },
        });
        setStoredUser(response.user); // Store the user in local storage
        enqueueSnackbar("Login successful!", { variant: "success" });
        // Navigate based on whether the user is a company or not
        navigate(response.user.isCompany ? "/company-dashboard" : "/main");
      } catch (error) {
        dispatch({
          type: ActionTypes.LOGIN_ERROR,
          payload: { error: error.response?.data?.error || "Login failed" },
        });
        enqueueSnackbar(error.response?.data?.error || "Login failed", {
          variant: "error",
        });
      }
    },
    [navigate, enqueueSnackbar]
  );

  const handleRegister = async (formData, isCompany = false) => {
    try {
      const response = isCompany
        ? await registerCompany(formData)
        : await registerUser(formData);
      dispatch({
        type: ActionTypes.REGISTER_SUCCESS,
        payload: { user: response.user },
      });
      enqueueSnackbar("Registration successful! Please log in.", {
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      dispatch({
        type: ActionTypes.REGISTER_ERROR,
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
    isElectionSaved: state.isElectionSaved,
    saveElectionError: state.saveElectionError,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
