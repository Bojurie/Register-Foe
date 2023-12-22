import React, { createContext, useEffect, useReducer } from "react";
import { loginUser, registerUser, saveElection } from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router-dom";
import {
  getStoredUser,
  removeStoredUser,
  removeStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

export const AuthContext = createContext();

// Action types
const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
};

// Reducer function
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
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = { user: null };
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

 useEffect(() => {
   // Check for user in local storage and update state accordingly
   const storedUser = getStoredUser();
   if (storedUser) {
     dispatch({
       type: ActionTypes.LOGIN_SUCCESS,
       payload: { user: storedUser },
     });
   }
 }, []);

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

  const handleLogin = async (formData) => {
    try {
      const user = await loginUser(formData);
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
      navigate("/main");
    } catch (error) {
      dispatch({
        type: ActionTypes.LOGIN_ERROR,
        payload: { error: error.message },
      });
    }
  };

  const handleRegister = async (formData) => {
    try {
      await registerUser(formData);
      console.log("User registered successfully");
    } catch (error) {
      dispatch({
        type: ActionTypes.REGISTER_ERROR,
        payload: { error: error.message },
      });
    }
  };

  const handleSaveElection = async (electionData) => {
    try {
      const response = await saveElection(electionData);
      if (response && response.success) {
        dispatch({ type: ActionTypes.SAVE_ELECTION_SUCCESS });
      } else {
        dispatch({
          type: ActionTypes.SAVE_ELECTION_ERROR,
          payload: { error: "Failed to save election" },
        });
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.SAVE_ELECTION_ERROR,
        payload: { error: error.message },
      });
    }
  };

  const contextValue = {
    user: state.user,
    handleLogin,
    handleLogout,
    handleRegister,
    handleSaveElection,
    saveElection, // Include saveElection here
    isElectionSaved: state.isElectionSaved,
    saveElectionError: state.saveElectionError,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
