import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  try {
    if (storedUser && typeof storedUser === "string") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);

    // Handle the error, e.g., by removing the invalid data from localStorage
    localStorage.removeItem("user");
  }
}, []);


  const login = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        formData
      );
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error("Invalid username or password.");
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await saveUserDataToDatabase(user);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.log("User is not logged in");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const saveUserDataToDatabase = async (userData) => {
    try {
      // Your logic to save user data to the database goes here
      // For simplicity, let's assume a delay using setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("User data saved to the database:", userData);
    } catch (error) {
      console.error("Error saving user data to the database:", error);
      throw error;
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
