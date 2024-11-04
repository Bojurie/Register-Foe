import React, { createContext, useContext,useEffect, useState } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

const ThemeContext = createContext();

export const themes = {
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
  cloudy: {
    background: "#A9A9A9",
    color: "#333",
    headingColor: "#333",
    iconColor: "#778899",
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#333", textDecoration: "none" },
    },
  },
  rainy: {
    background: "#5F9EA0",
    color: "#EAEAEA",
    headingColor: "#fff",
    iconColor: "#4682B4",
    typography: {
      h1: { color: "#EAEAEA", fontSize: "2.5rem" },
      h2: { color: "#EAEAEA", fontSize: "2rem" },
      h3: { color: "#EAEAEA", fontSize: "1.75rem" },
      h4: { color: "#EAEAEA", fontSize: "1.5rem" },
      h5: { color: "#EAEAEA", fontSize: "1.25rem" },
      p: { color: "#EAEAEA", fontSize: "1rem" },
      a: { color: "#fff", textDecoration: "underline" },
    },
  },
  stormy: {
    background: "#2F4F4F",
    color: "#fff",
    headingColor: "#F0E68C",
    iconColor: "#F0E68C",
    typography: {
      h1: { color: "#fff", fontSize: "2.5rem" },
      h2: { color: "#fff", fontSize: "2rem" },
      h3: { color: "#fff", fontSize: "1.75rem" },
      h4: { color: "#fff", fontSize: "1.5rem" },
      h5: { color: "#fff", fontSize: "1.25rem" },
      p: { color: "#fff", fontSize: "1rem" },
      a: { color: "#F0E68C", textDecoration: "underline" },
    },
  },
  snowy: {
    background: "#F0F8FF",
    color: "#333",
    headingColor: "#333",
    iconColor: "#87CEFA",
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#87CEFA", textDecoration: "underline" },
    },
  },
  misty: {
    background: "#E0E0E0",
    color: "#333",
    headingColor: "#333",
    iconColor: "#B0C4DE",
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#333", textDecoration: "none" },
    },
  },
  foggy: {
    background: "#696969",
    color: "#EAEAEA",
    headingColor: "#fff",
    iconColor: "#A9A9A9",
    typography: {
      h1: { color: "#EAEAEA", fontSize: "2.5rem" },
      h2: { color: "#EAEAEA", fontSize: "2rem" },
      h3: { color: "#EAEAEA", fontSize: "1.75rem" },
      h4: { color: "#EAEAEA", fontSize: "1.5rem" },
      h5: { color: "#EAEAEA", fontSize: "1.25rem" },
      p: { color: "#EAEAEA", fontSize: "1rem" },
      a: { color: "#fff", textDecoration: "underline" },
    },
  },
  windy: {
    background: "#00CED1",
    color: "#fff",
    headingColor: "#fff",
    iconColor: "#20B2AA",
    typography: {
      h1: { color: "#fff", fontSize: "2.5rem" },
      h2: { color: "#fff", fontSize: "2rem" },
      h3: { color: "#fff", fontSize: "1.75rem" },
      h4: { color: "#fff", fontSize: "1.5rem" },
      h5: { color: "#fff", fontSize: "1.25rem" },
      p: { color: "#fff", fontSize: "1rem" },
      a: { color: "#20B2AA", textDecoration: "underline" },
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay); // Default theme

  // Update theme based on weather icon and hour
  const updateTheme = (weatherIcon, hour) => {
    if (weatherIcon.includes("n")) {
      setCurrentTheme(themes.clearNight); // Use night theme if the icon indicates night
    } else if (hour < 18) {
      setCurrentTheme(themes.clearDay); // Day theme for daytime
    } else {
      setCurrentTheme(themes.clearNight); // Default to night theme
    }
  };

  // Load saved theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save current theme to local storage when it changes
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(currentTheme));
  }, [currentTheme]); // Only runs when currentTheme changes

  const value = { currentTheme, updateTheme };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={currentTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};