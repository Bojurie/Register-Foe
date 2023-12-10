import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Logic to authenticate the user
       const authenticateUser = () => {
         if (!username || !password) {
           console.error("Username and password are required");
           return;
         }
       };
       const userData = authenticateUser();
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
