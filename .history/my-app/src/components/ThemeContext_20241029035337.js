import React, { createContext, useContext, useState } from "react";

// Create Theme Context
const ThemeContext = createContext();

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
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light); // Default theme

  const updateTheme = (weatherIcon, hour) => {
    if (hour >= 6 && hour < 18) {
      setTheme(themes.light);
    } else {
      setTheme(themes.dark);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
