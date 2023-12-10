import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (user) {
        await saveUserDataToDatabase(user);
        setUser((prevUser) => null); // Update user state functionally
        window.location.href = "/login"; // Change this to your home page URL
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

// Utility function to save user data to the database
export const saveUserDataToDatabase = async (userData) => {
  try {
    // Your logic to save user data to the database goes here
    // For simplicity, let's assume a delay using setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("User data saved to the database:", userData);
  } catch (error) {
    console.error("Error saving user data to the database:", error);
    throw error; // Re-throw the error to be caught by the logout function
  }
};
