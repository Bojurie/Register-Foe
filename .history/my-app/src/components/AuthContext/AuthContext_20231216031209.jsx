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
      console.error(error);
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

  const logout = async () => {
    try {
      if (user) {
        // Perform any necessary actions before logging out
        console.log("User data saved to the database:", user);
      }

      setUser(null);
      removeStoredUser();
      removeStoredToken();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const contextValue = {
    user,
    login,
    logout, // Include the logout function in the context
    isAuthenticated: !!user,
    fetchData,
    loginUser,
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
