import React, { createContext, useContext, useState } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Theme definitions
const themes = {
  light: {
    background: "#f9f9f9",
    color: "#333",
    button: {
      background: "#7d0808",
      color: "#ffffff",
      hoverBackground: "#8c1818",
    },
    heading: {
      color: "#162251",
    },
    text: {
      color: "#333",
    },
  },
  dark: {
    background: "#333",
    color: "#f9f9f9",
    button: {
      background: "#5b0b0b",
      color: "#ffffff",
      hoverBackground: "#9c3c3c",
    },
    heading: {
      color: "#f9f9f9",
    },
    text: {
      color: "#f0f0f0",
    },
  },
  vibrant: {
    background: "#ffecb3",
    color: "#5d4037",
    button: {
      background: "#f57f17",
      color: "#ffffff",
      hoverBackground: "#ffb300",
    },
    heading: {
      color: "#e65100",
    },
    text: {
      color: "#3e2723",
    },
  },
  pastel: {
    background: "#e3f2fd",
    color: "#1e88e5",
    button: {
      background: "#64b5f6",
      color: "#ffffff",
      hoverBackground: "#2196f3",
    },
    heading: {
      color: "#1976d2",
    },
    text: {
      color: "#0d47a1",
    },
  },
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light); // Default theme

  const toggleTheme = () => {
    setTheme((prev) => (prev === themes.light ? themes.dark : themes.light));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
export const useTheme = () => {
  return useContext(ThemeContext);
};
