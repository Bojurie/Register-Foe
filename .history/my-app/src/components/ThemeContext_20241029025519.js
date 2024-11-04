import React, { createContext, useContext, useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";

const ThemeContext = createContext();

const themes = {
  clearSky: {
    background: "linear-gradient(to top, #87CEEB, #B0E0E6)",
    color: "#333",
  },
  rain: {
    background: "linear-gradient(to top, #4B9CD3, #1B1B1B)",
    color: "#fff",
  },
  snow: {
    background: "linear-gradient(to top, #D9E6F2, #A3C1DA)",
    color: "#333",
  },
  night: {
    background: "linear-gradient(to top, #2C3E50, #000)",
    color: "#fff",
  },
};

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    transition: background 0.5s ease, color 0.5s ease;
  }
`;

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());

  function getInitialTheme() {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? JSON.parse(savedTheme) : themes.clearSky;
  }

  const updateTheme = (weatherIcon, hour) => {
    let newTheme;
    if (weatherIcon === "01d") {
      newTheme = themes.clearSky;
    } else if (weatherIcon.includes("09") || weatherIcon.includes("10")) {
      newTheme = themes.rain;
    } else if (weatherIcon.includes("13")) {
      newTheme = themes.snow;
    } else {
      newTheme = hour < 6 || hour >= 18 ? themes.night : themes.clearSky;
    }

    setCurrentTheme(newTheme);
    localStorage.setItem("theme", JSON.stringify(newTheme));
  };

  useEffect(() => {
    const hour = new Date().getHours();
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const parsedTheme = JSON.parse(savedTheme);
      setCurrentTheme(parsedTheme);
    } else {
      setCurrentTheme(themes.clearSky);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme }}>
      <GlobalStyle theme={currentTheme} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
