// StyledComponents.js
import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

// Define themes
export const themes = {
  clearDay: {
    background: "linear-gradient(to right, #FFD580, #FFA500)",
    color: "#333",
    headingColor: "#818167",
    iconColor: "#FFA500",
    linkColor: "#FF8C00",
    button: {
      background: "#FFA500",
      color: "#595948",
      hoverBackground: "#FFB84D",
    },
  },
  clearNight: {
    background: "linear-gradient(to right, #2B2B52, #4B0082)",
    color: "#EAEAEA",
    headingColor: "#D8BFD8",
    iconColor: "#4B0082",
    linkColor: "#8A2BE2",
    button: {
      background: "#4B0082",
      color: "#EAEAEA",
      hoverBackground: "#6A0DAD",
    },
  },
  // You can add more themes here
  rainyDay: {
    background: "linear-gradient(to right, #A9C1D5, #A2B4C2)",
    color: "#2F3E46",
    headingColor: "#1A1A2E",
    iconColor: "#2F3E46",
    linkColor: "#A2B4C2",
    button: {
      background: "#2F3E46",
      color: "#FFFFFF",
      hoverBackground: "#3D5B78",
    },
  },
  snowyDay: {
    background: "linear-gradient(to right, #E6F2FF, #A7C6ED)",
    color: "#1B262B",
    headingColor: "#0F4C75",
    iconColor: "#1B262B",
    linkColor: "#0F4C75",
    button: {
      background: "#1B262B",
      color: "#FFFFFF",
      hoverBackground: "#0F4C75",
    },
  },
};

// Create global styles
export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    transition: background 0.3s, color 0.3s;
  }
`;

// Create context for theme management
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.clearDay);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === themes.clearDay ? themes.clearNight : themes.clearDay
    );
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(JSON.parse(storedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Styled components
export const Button = styled.button`
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.color};
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.button.hoverBackground};
  }
`;

export const Heading = styled.h1`
  color: ${({ theme }) => theme.headingColor};
`;

export const Link = styled.a`
  color: ${({ theme }) => theme.linkColor};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
