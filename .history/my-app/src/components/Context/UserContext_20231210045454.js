import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const authenticateUser = () => {
      if (!userData || !userData.username || !userData.password) {
        console.error("Invalid user data. Username and password are required.");
        return;
      }
    };

    authenticateUser();
    setUser(userData);
  };

  const logout = () => {
    // Logic to log out the user
    setUser(null);
  };

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
