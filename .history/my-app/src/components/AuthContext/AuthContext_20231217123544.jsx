// AuthContext.js
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { loginUser, registerUser } from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const AuthContext = createContext();

// Action types
const ActionTypes = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_SUCCESS:
    case ActionTypes.REGISTER_SUCCESS:
      return { ...state, user: action.payload.user };
    case ActionTypes.LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = { user: null };
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (token) {
        const user = getStoredUser();
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
      }
    };
    initializeAuth();
  }, []);

  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      if (response.success) {
        console.log("User registered successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const login = async (formData) => {
    try {
      const { user, token } = await loginUser(formData);
      setStoredUser(user);
      setStoredToken(token);
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: { user } });
      navigate("/main");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    removeStoredUser();
    removeStoredToken();
    dispatch({ type: ActionTypes.LOGOUT });
    navigate("/login");
  };

  const contextValue = {
    user: state.user,
    login,
    logout,
    register,
    isAuthenticated: !!state.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
