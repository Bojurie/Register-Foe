// src/components/WeatherWidget/StyledComponents.js
import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

// Define themes
export const themes = {
  morning: {
    background: "linear-gradient(to right, #FFD580, #FFA500)",
    color: "#333",
    headingColor: "#818167",
    iconColor: "#FFA500",
    linkColor: "#FF8C00",
    fontSize: "1rem",
    button: {
      background: "#FFA500",
      color: "#595948",
      hoverBackground: "#FFB84D",
    },
  },
  afternoon: {
    background: "linear-gradient(to right, #FFDB58, #FF8C00)",
    color: "#333",
    headingColor: "#333",
    iconColor: "#FF8C00",
    linkColor: "#FF4500",
    fontSize: "1.1rem",
    button: {
      background: "#FF8C00",
      color: "#fff",
      hoverBackground: "#FFA07A",
    },
  },
  night: {
    background: "#2f4763",
    color: "#b39f7c",
    headingColor: "#b39f7c",
    iconColor: "#4B0082",
    linkColor: "#8A2BE2",
    fontSize: "1rem",
    button: {
      background: "#4B0082",
      color: "#EAEAEA",
      hoverBackground: "#6A0DAD",
    },
  },
  rainy: {
    background: "linear-gradient(to right, #A9C1D5, #A2B4C2)",
    color: "#2F3E46",
    headingColor: "#1A1A2E",
    iconColor: "#2F3E46",
    linkColor: "#A2B4C2",
    fontSize: "1rem",
    button: {
      background: "#2F3E46",
      color: "#FFFFFF",
      hoverBackground: "#3D5B78",
    },
  },
  sunny: {
    background: "linear-gradient(to right, #FFD700, #FFA500)",
    color: "#333",
    headingColor: "#333",
    iconColor: "#FFA500",
    linkColor: "#FF4500",
    fontSize: "1.2rem",
    button: {
      background: "#FFA500",
      color: "#595948",
      hoverBackground: "#FFB84D",
    },
  },
  clearSky: {
    background: "#87CEEB",
    color: "#000",
    headingColor: "#333",
    iconColor: "#FFA500",
    linkColor: "#4682B4",
    fontSize: "1rem",
    button: {
      background: "#4682B4",
      color: "#fff",
      hoverBackground: "#5A9BD3",
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
    font-size: ${({ theme }) => theme.fontSize};
    transition: background 0.3s, color 0.3s;
  }

  h1, h2, h3, h4, h5 {
    color: ${({ theme }) => theme.headingColor};
    font-size: calc(${({ theme }) => theme.fontSize} + 0.2rem);
  }

  a {
    color: ${({ theme }) => theme.linkColor};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  p {
    color: ${({ theme }) => theme.color};
    font-size: ${({ theme }) => theme.fontSize};
  }
`;

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.morning);

  const updateTheme = (weatherIcon, hour) => {
    if (hour >= 18 || hour < 6) {
      setTheme(themes.night);
    } else if (weatherIcon.includes("rain")) {
      setTheme(themes.rainy);
    } else if (weatherIcon.includes("clear") && hour >= 6 && hour < 12) {
      setTheme(themes.morning);
    } else if (weatherIcon.includes("clear") && hour >= 12 && hour < 18) {
      setTheme(themes.afternoon);
    } else {
      setTheme(themes.clearSky);
    }
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
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const Button = styled.button`
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.color};
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize};
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.button.hoverBackground};
  }
`;