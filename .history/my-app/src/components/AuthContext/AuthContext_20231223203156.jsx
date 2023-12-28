import React, { createContext, useReducer, useCallback, useContext, useEffect } from "react";
import { jwtDecode as jwt_decode } from "jwt-decode";
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
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

export const AuthContext = createContext();

const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  SAVE_ELECTION_SUCCESS: "SAVE_ELECTION_SUCCESS",
  SAVE_ELECTION_ERROR: "SAVE_ELECTION_ERROR",
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
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: getStoredUser() });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: storedUser },
      });
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

  const handleLogin = useCallback(
    async (formData) => {
      try {
        const user = await login(formData);
        console.log("Login response data:", user);

        const { token } = user;
        if (typeof token !== "string" || token.trim() === "") {
          throw new Error("Invalid token received from login API");
        }

        setStoredUser(user);
        setStoredToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        let decodedToken;
        try {
          decodedToken = jwt_decode(token);
        } catch (error) {
          throw new Error("Failed to decode token");
        }

        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user: decodedToken },
        });

        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/main");
      } catch (error) {
        console.error("Login error:", error);
        dispatch({
          type: ActionTypes.LOGIN_ERROR,
          payload: { error: error.message || "Login failed" },
        });
        enqueueSnackbar(error.message || "Login failed", { variant: "error" });
      }
    },
    [navigate, enqueueSnackbar, dispatch]
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