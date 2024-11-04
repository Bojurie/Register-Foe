import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

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
      border: "2px solid #FF8C00",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
      border: "2px solid #FFD700",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
      background: "#b39f7c",
      color: "#2f4763",
      hoverBackground: "#6A0DAD",
      border: "2px solid #8A2BE2",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
      border: "2px solid #A9C1D5",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
      border: "2px solid #FFD700",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
      border: "2px solid #87CEEB",
      borderRadius: "5px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
  },
};

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
  h1 {
    color: ${({ theme }) => theme.headingColor};
  }
  h2, h3, h4, h5 {
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
  border: ${({ theme }) => theme.button.border};
  border-radius: ${({ theme }) => theme.button.borderRadius};
  padding: 10px 20px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize};
  transition: background 0.3s, transform 0.2s, box-shadow 0.2s;
  box-shadow: ${({ theme }) => theme.button.boxShadow};

  &:hover {
    background: ${({ theme }) => theme.button.hoverBackground};
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.5);
  }
`;
