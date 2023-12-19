import React, { createContext, useContext, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext"; // Import useAuth from AuthContext.jsx

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: authUser, login, logout } = useAuth(); // Use useAuth from AuthContext.jsx
  const [user, setUser] = useState(authUser);

  const contextValue = { user, login, logout };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => {
  const { user, login, logout } = useUser();
  return {
    user,
    login,
    logout,
  };
};
