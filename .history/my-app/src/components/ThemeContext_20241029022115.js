// src/ThemeContext.js
import React, { createContext, useContext, useState } from "react";
import themes from "./themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.default);

  const updateTheme = (weatherCode, isNight) => {
    if (isNight) {
      setCurrentTheme(themes.nighttime);
    } else {
      switch (weatherCode) {
        case "01d":
          setCurrentTheme(themes.clearSky);
          break;
        case "09d":
        case "10d":
        case "09n":
        case "10n":
          setCurrentTheme(themes.raining);
          break;
        case "13d":
        case "13n":
          setCurrentTheme(themes.snowing);
          break;
        default:
          setCurrentTheme(themes.default);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
