import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for a previously authenticated user on component mount
useEffect(() => {
  const storedUser = localStorage.getItem("user");

  try {
    // Check if storedUser is not undefined and is a valid JSON string
    if (storedUser && typeof storedUser === "string") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
  }
}, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      if (user) {
        await saveUserDataToDatabase(user);
        setUser(null); // Update user state functionally
        localStorage.removeItem("user");
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
