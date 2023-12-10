// AuthDataProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredUser,
  removeStoredUser,
  setStoredUser,
} from "../LocalStorageManager/LocalStorageManager";
import { loginUser, fetchUserDetails } from "../AuthAPI/AuthAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserDetails()
        .then((userData) => setUser(userData))
        .catch((error) => console.error("Error fetching user details:", error));
    } else {
      setUser(null);
    }
  }, []);

  const login = async (formData) => {
    try {
      const { user, token } = await loginUser(formData);

      setStoredUser(user);
      localStorage.setItem("token", token);
      setUser(user);
    } catch (error) {
      throw error;
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
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.log("User is not logged in");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
