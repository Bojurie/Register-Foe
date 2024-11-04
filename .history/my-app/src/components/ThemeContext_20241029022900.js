import React, { createContext, useContext, useState } from "react";
import themes from "./themes";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearSky);

  const updateTheme = (weatherCode) => {
    if (weatherCode === "01d") {
      setCurrentTheme(themes.clearSky);
    } else if (weatherCode.includes("09") || weatherCode.includes("10")) {
      setCurrentTheme(themes.rain);
    } else if (weatherCode.includes("13")) {
      setCurrentTheme(themes.snow);
    } else {
      const hour = new Date().getHours();
      setCurrentTheme(hour < 6 || hour >= 18 ? themes.night : themes.clearSky);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
