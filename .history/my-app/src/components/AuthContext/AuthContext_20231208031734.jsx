// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, fetchUserDetails } from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  removeStoredUser,
  setStoredUser,
  removeStoredToken,
  setStoredToken,
  getStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getStoredToken();

        if (token) {
          const userData = await fetchUserDetails();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Handle error gracefully, e.g., show a user-friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const login = async (formData) => {
    try {
      const { user, token } = await loginUser(formData);

      setStoredUser(user);
      setStoredToken(token);
      setUser(user);
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      if (user) {
        // Your logic to save user data to the database goes here
        // For simplicity, let's assume a delay using setTimeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("User data saved to the database:", user);

        setUser(null);
        removeStoredUser();
        removeStoredToken();
        window.location.href = "/login"; // Redirect to login page after logout
      } else {
        console.log("User is not logged in");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    // You might want to show a spinner or another loading indicator
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
