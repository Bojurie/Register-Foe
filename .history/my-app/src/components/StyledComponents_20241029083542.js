import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

const themes = {
  clearDay: {
    background: "#FFD580",
    color: "#333",
    headingColor: "#333",
    iconColor: "#FFA500",
  },
  clearNight: {
    background: "#2B2B52",
    color: "#EAEAEA",
    headingColor: "#D8BFD8",
    iconColor: "#4B0082",
  },
  cloudy: {
    background: "#A9A9A9",
    color: "#333",
    headingColor: "#333",
    iconColor: "#778899",
  },
  rainy: {
    background: "#5F9EA0",
    color: "#EAEAEA",
    headingColor: "#fff",
    iconColor: "#4682B4",
  },
  // ... other themes
  snowy: {
    background: "#F0F8FF",
    color: "#333",
    headingColor: "#333",
    iconColor: "#87CEFA",
  },
  windy: {
    background: "#00CED1",
    color: "#fff",
    headingColor: "#fff",
    iconColor: "#20B2AA",
  },
};

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
    font-family: Arial, sans-serif;
  }
`;

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const updateTheme = (weatherIcon, hour) => {
    if (weatherIcon.includes("n")) {
      setCurrentTheme(themes.clearNight);
    } else {
      setCurrentTheme(hour < 18 ? themes.clearDay : themes.clearNight);
    }
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

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
    font-family: Arial, sans-serif;
  }
`;

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const updateTheme = (weatherIcon, hour) => {
    if (weatherIcon.includes("n")) {
      setCurrentTheme(themes.clearNight);
    } else {
      setCurrentTheme(hour < 18 ? themes.clearDay : themes.clearNight);
    }
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

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
