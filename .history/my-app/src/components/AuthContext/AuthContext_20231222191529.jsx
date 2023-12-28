import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { createContext, useEffect, useReducer, useContext } from "react";
import {
  loginUser,
  registerUser,
  loginCompany,
  registerCompany,
  saveElection,
} from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router-dom";
import {
  getStoredUser,
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
  const initialState = { user: null };
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    toast.configure();
    const storedUser = getStoredUser();
    if (storedUser) {
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: storedUser },
      });
      toast("Welcome back!", { type: "success" });
      navigate("/main");
    }
  }, [navigate, dispatch]);

  const handleLogout = () => {
    removeStoredUser();
    removeStoredToken();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

  const handleLogin = async (formData, isCompany = false) => {
    try {
      const response = isCompany
        ? await loginCompany(formData)
        : await loginUser(formData);
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: response.user },
      });
      toast("Login successful!", { type: "success" });
      navigate(response.user.isCompany ? "/company-dashboard" : "/main");
    } catch (error) {
      dispatch({
        type: ActionTypes.LOGIN_ERROR,
        payload: { error: error.message },
      });
      toast(error.message, { type: "error" });
    }
  };

  const handleRegister = async (formData, isCompany = false) => {
    try {
      const response = isCompany
        ? await registerCompany(formData)
        : await registerUser(formData);
      dispatch({
        type: ActionTypes.REGISTER_SUCCESS,
        payload: { user: response.user },
      });
      toast("Registration successful! Please log in.", { type: "success" });
      navigate("/login");
    } catch (error) {
      dispatch({
        type: ActionTypes.REGISTER_ERROR,
        payload: { error: error.message },
      });
      toast(error.message, { type: "error" });
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
    isElectionSaved: state.isElectionSaved,
    saveElectionError: state.saveElectionError,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
toast.configure();
export const useAuth = () => useContext(AuthContext);
