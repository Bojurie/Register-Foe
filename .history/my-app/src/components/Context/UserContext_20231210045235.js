import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    const authenticateUser = () => {
      if (!userData) {
        console.error("Username and password are required");
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

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const userContext = useUser();
  return {
    user: userContext.user,
    login: userContext.login,
    logout: userContext.logout,
  };
};
