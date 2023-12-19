import React, { createContext, useContext, useEffect, useReducer } from "react";
import { loginUser } from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router";
import {
  getStoredUser,
  removeStoredUser,
  getStoredToken,
  removeStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const AuthContext = createContext();

// Action types
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const initialState = {
    user: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const register = async (formData) => {
    try {
      const response = await registerUser(formData);
      if (response.success) {
        console.log("User registered successfully");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };
  const fetchData = async () => {
    try {
      const token = getStoredToken();

      if (token) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: getStoredUser() },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = async (formData) => {
    try {
      const user = await loginUser(formData);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user },
      });
      navigate("/main");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (state.user) {
        console.log("User data saved to the database:", state.user);
      }

      dispatch({ type: LOGOUT_SUCCESS });
      removeStoredUser();
      removeStoredToken();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const contextValue = {
    user: state.user,
    login,
    logout,
    register,
    isAuthenticated: !!state.user,
    fetchData,
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
