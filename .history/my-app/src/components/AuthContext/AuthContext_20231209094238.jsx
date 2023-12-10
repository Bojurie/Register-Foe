import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router";
import {
  getStoredUser,
  removeStoredUser,
  setStoredUser,
  getStoredToken,
  removeStoredToken,
  setStoredToken,
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
      console.error("Error fetching user details:", error.message);
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

      if (!user || typeof user.id === "undefined") {
        console.warn("Invalid user data received during login");
      }

      setStoredUser(user);
      setUser(user);
    } catch (error) {
      console.error("Error during login:", error.message);
      throw new Error("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("User data saved to the database:", user);
      }

      setUser(null);
      removeStoredUser();
      removeStoredToken();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        fetchData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
