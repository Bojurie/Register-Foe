import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, fetchUserDetails } from "../AuthAPI/AuthAPI";
import { useNavigate } from "react-router";
import {
  getStoredUser,
  removeStoredUser,
  setStoredUser,
  getStoredToken,
  removeStoredToken,
  setStoredToken,
} from "../LocalStorageManager/LocalStorageManager";

// Define AuthContext here, outside of the component
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = getStoredToken();

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
      if (!user || typeof user.id === "undefined") {
        console.warn("Invalid user data received during login");
      }

      setStoredUser(user);
      setStoredToken(token);
      setUser(user);
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
      removeStoredToken();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  if (loading) {
    // You might want to show a loading spinner or some indication while fetching user data
    return <div>Loading...</div>;
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

export const useAuth = () => {
  return useContext(AuthContext);
};
