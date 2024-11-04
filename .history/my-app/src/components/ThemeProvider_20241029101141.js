import React, { createContext, useContext, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
} from "./StyledComponents"; // Adjust the path as needed

// Define theme properties in an organized way
const themes = {
  clearDay: {
    background: "#FFD580",
    color: "#333",
    headingColor: "#333",
    iconColor: "#FFA500",
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#FFA500", textDecoration: "none" },
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
      h3: { color: "#EAEAEA", fontSize: "1.75rem" },
      h4: { color: "#EAEAEA", fontSize: "1.5rem" },
      h5: { color: "#EAEAEA", fontSize: "1.25rem" },
      p: { color: "#EAEAEA", fontSize: "1rem" },
      a: { color: "#D8BFD8", textDecoration: "underline" },
    },
  },
  // Add other themes as necessary
};

// Create context for the theme
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay);

  // Function to update theme based on weather conditions
  const updateTheme = (weatherIcon, hour) => {
    const themeKey = weatherIcon.includes("n") ? "clearNight" : "clearDay";
    setCurrentTheme(themes[themeKey]);
  };

  // Provide current theme and update function to the context
  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme }}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
