import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, fetchUserDetails } from "../AuthAPI/AuthAPI";
import {
  getStoredUser,
  removeStoredUser,
  setStoredUser,
} from "../LocalStorageManager/LocalStorageManager";
import LoadingIndicator from "../LoadingIndicator";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const userData = await fetchUserDetails();

        // Check if the API returned valid user data
        if (!userData || typeof userData.id === "undefined") {
          throw new Error("Invalid user data received");
        }

        setUser(userData);
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
      const { user, token } = await loginUser(formData);
      // Check if the API returned valid user data
      

      setStoredUser(user);
      localStorage.setItem("token", token);
      setUser(user);
      if (!user || typeof user.id === "undefined") {
        console.warn("Invalid user data received during login");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
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
      }

      setUser(null);
      removeStoredUser();
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  if (loading) {
    // You might want to show a loading spinner or some indication while fetching user data
    return <LoadingIndicator />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        fetchData, // expose fetchData for reusability
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
