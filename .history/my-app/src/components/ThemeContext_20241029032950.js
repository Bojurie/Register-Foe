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
      fontSize: "24px",
    },
    text: {
      color: "#333",
      fontSize: "16px",
    },
    h1: {
      color: "#162251",
      fontSize: "36px",
    },
    h2: {
      color: "#162251",
      fontSize: "30px",
    },
    h3: {
      color: "#162251",
      fontSize: "24px",
    },
    h4: {
      color: "#162251",
      fontSize: "20px",
    },
    p: {
      color: "#333",
      fontSize: "16px",
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
      fontSize: "24px",
    },
    text: {
      color: "#f0f0f0",
      fontSize: "16px",
    },
    h1: {
      color: "#f9f9f9",
      fontSize: "36px",
    },
    h2: {
      color: "#f9f9f9",
      fontSize: "30px",
    },
    h3: {
      color: "#f9f9f9",
      fontSize: "24px",
    },
    h4: {
      color: "#f9f9f9",
      fontSize: "20px",
    },
    p: {
      color: "#f0f0f0",
      fontSize: "16px",
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
      fontSize: "24px",
    },
    text: {
      color: "#3e2723",
      fontSize: "16px",
    },
    h1: {
      color: "#e65100",
      fontSize: "36px",
    },
    h2: {
      color: "#e65100",
      fontSize: "30px",
    },
    h3: {
      color: "#e65100",
      fontSize: "24px",
    },
    h4: {
      color: "#e65100",
      fontSize: "20px",
    },
    p: {
      color: "#3e2723",
      fontSize: "16px",
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
      fontSize: "24px",
    },
    text: {
      color: "#0d47a1",
      fontSize: "16px",
    },
    h1: {
      color: "#1976d2",
      fontSize: "36px",
    },
    h2: {
      color: "#1976d2",
      fontSize: "30px",
    },
    h3: {
      color: "#1976d2",
      fontSize: "24px",
    },
    h4: {
      color: "#1976d2",
      fontSize: "20px",
    },
    p: {
      color: "#0d47a1",
      fontSize: "16px",
    },
  },
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light); // Default theme

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === themes.light ? themes.dark : themes.light
    );
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
