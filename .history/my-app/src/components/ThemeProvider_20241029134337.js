// ThemeProvider.js

import React, { createContext, useContext, useState, useEffect } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

// Define theme properties
export const themes = {
  clearDay: {
    background: "#FFD580",
    color: "#333",
    headingColor: "#333",
    iconColor: "#FFA500",
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      p: { color: "#333", fontSize: "1rem" },
    },
  },
  clearNight: {
    background: "#2B2B52",
    color: "#EAEAEA",
    headingColor: "#D8BFD8",
    iconColor: "#4B0082",
    typography: {
      h1: { color: "#EAEAEA", fontSize: "2.5rem" },
      h2: { color: "#EAEAEA", fontSize: "2rem" },
      p: { color: "#EAEAEA", fontSize: "1rem" },
    },
  },
};

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
    font-family: Arial, sans-serif;
  }
`;

// Create Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay);

  // Save and retrieve theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  // Function to update theme based on weather icon and time
  const updateTheme = (weatherIcon, hour) => {
    const themeKey = weatherIcon.includes("n") ? "clearNight" : "clearDay";
    setCurrentTheme(themes[themeKey]);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
