import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router";
import {
  getStoredUser,
  removeStoredUser,
  getStoredToken,
  removeStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = getStoredToken();

      if (token) {
        setUser(getStoredUser());
      }
    } catch (error) {
      console.error(error); // Log the error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = async (formData) => {
    try {
      const user = await loginUser(formData);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Expose loginUser in the context
  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    fetchData,
    loginUser, // Expose loginUser function
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
