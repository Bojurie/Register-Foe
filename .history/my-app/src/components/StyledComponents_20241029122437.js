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
    linkColor: "#FF8C00",
    button: {
      background: "#FFA500",
      color: "#333",
      hoverBackground: "#FFB84D",
    },
  },
  clearNight: {
    background: "#2B2B52",
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
  cloudyDay: {
    background: "#A9A9A9",
    color: "#333",
    headingColor: "#333",
    iconColor: "#778899",
    linkColor: "#6A5ACD",
    button: {
      background: "#778899",
      color: "#FFF",
      hoverBackground: "#8A9EA9",
    },
  },
  cloudyNight: {
    background: "#4F4F4F",
    color: "#EAEAEA",
    headingColor: "#C0C0C0",
    iconColor: "#708090",
    linkColor: "#A9A9A9",
    button: {
      background: "#708090",
      color: "#FFF",
      hoverBackground: "#8A9EA9",
    },
  },
  rainyDay: {
    background: "#5F9EA0",
    color: "#EAEAEA",
    headingColor: "#fff",
    iconColor: "#4682B4",
    linkColor: "#6495ED",
    button: {
      background: "#4682B4",
      color: "#FFF",
      hoverBackground: "#5A9ACF",
    },
  },
  rainyNight: {
    background: "#003366",
    color: "#D3D3D3",
    headingColor: "#B0C4DE",
    iconColor: "#1E90FF",
    linkColor: "#87CEEB",
    button: {
      background: "#1E90FF",
      color: "#FFF",
      hoverBackground: "#4F94CD",
    },
  },
  snowyDay: {
    background: "#F0F8FF",
    color: "#333",
    headingColor: "#333",
    iconColor: "#87CEFA",
    linkColor: "#4682B4",
    button: {
      background: "#87CEFA",
      color: "#333",
      hoverBackground: "#ADD8E6",
    },
  },
  snowyNight: {
    background: "#A9A9A9",
    color: "#F0FFFF",
    headingColor: "#B0C4DE",
    iconColor: "#B0E0E6",
    linkColor: "#E0FFFF",
    button: {
      background: "#B0E0E6",
      color: "#333",
      hoverBackground: "#A0D0D9",
    },
  },
  windy: {
    background: "#00CED1",
    color: "#fff",
    headingColor: "#fff",
    iconColor: "#20B2AA",
    linkColor: "#AFEEEE",
    button: {
      background: "#20B2AA",
      color: "#fff",
      hoverBackground: "#40C8BB",
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
    transition: background-color 0.5s ease, color 0.5s ease;
  }

  h1, h2, h3, h4, h5 {
    color: ${(props) => props.theme.headingColor};
    transition: color 0.5s ease;
  }

  p {
    line-height: 1.6;
    margin: 1em 0;
    color: ${(props) => props.theme.color};
    transition: color 0.5s ease;
  }

  a {
    color: ${(props) => props.theme.linkColor};
    text-decoration: none;
    transition: color 0.5s ease;
  }

  a:hover {
    text-decoration: underline;
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

  const updateTheme = (weatherCode, hour) => {
    if (weatherCode.includes("n")) {
      if (
        weatherCode.startsWith("02") ||
        weatherCode.startsWith("03") ||
        weatherCode.startsWith("04")
      ) {
        setCurrentTheme(themes.cloudyNight);
      } else if (weatherCode.startsWith("09") || weatherCode.startsWith("10")) {
        setCurrentTheme(themes.rainyNight);
      } else if (weatherCode.startsWith("13")) {
        setCurrentTheme(themes.snowyNight);
      } else {
        setCurrentTheme(themes.clearNight);
      }
    } else {
      if (
        weatherCode.startsWith("02") ||
        weatherCode.startsWith("03") ||
        weatherCode.startsWith("04")
      ) {
        setCurrentTheme(themes.cloudyDay);
      } else if (weatherCode.startsWith("09") || weatherCode.startsWith("10")) {
        setCurrentTheme(themes.rainyDay);
      } else if (weatherCode.startsWith("13")) {
        setCurrentTheme(themes.snowyDay);
      } else if (weatherCode === "windy") {
        setCurrentTheme(themes.windy);
      } else {
        setCurrentTheme(hour < 18 ? themes.clearDay : themes.clearNight);
      }
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

export { themes };

// Styled Button Component
const StyledButton = styled.button`
  background-color: ${(props) => props.theme.button.background};
  color: ${(props) => props.theme.button.color};
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.5s ease, color 0.5s ease;

  &:hover {
    background-color: ${(props) => props.theme.button.hoverBackground};
  }
`;

export { StyledButton };
