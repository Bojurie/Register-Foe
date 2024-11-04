import React, { createContext, useContext, useState } from "react";
import styled, { ThemeProvider as StyledThemeProvider } from "./StyledComponents"; // Adjust the path as needed

const themes = {
  clearDay: { background: "#FFD580", color: "#333" },
  clearNight: { background: "#2B2B52", color: "#EAEAEA" },
  // Add additional themes...
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay);

  const updateTheme = (weatherIcon, hour) => {
    const themeKey = weatherIcon.includes("n") ? "clearNight" : hour < 18 ? "clearDay" : "clearDay";
    setCurrentTheme(themes[themeKey]);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme }}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};