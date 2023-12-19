import React, { createContext, useContext, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext.jsx";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: authUser, login, logout } = useAuth();
  const [user, setUser] = useState(authUser);

  const contextValue = { user, login, logout };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserAuth = () => {
  const { user, login, logout } = useUser();
  return {
    user,
    login,
    logout,
  };
};
