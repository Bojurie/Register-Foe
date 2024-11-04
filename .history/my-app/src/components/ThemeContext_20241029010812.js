// src/components/ThemeContext.js
import React, { createContext, useContext, useState } from "react";

// Create a Theme Context
const ThemeContext = createContext();

// ThemeProvider component to provide the theme context
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};
