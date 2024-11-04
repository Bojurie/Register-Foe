import React, { createContext, useContext, useState, useEffect } from "react";
import { theme } from "./StyledComponents"; // Ensure this path is correct

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(theme.default); // Default theme

  // Update theme based on weather icon and hour
  const updateTheme = (weatherIcon, hour) => {
    if (weatherIcon.includes("n")) {
      setCurrentTheme(theme.night); // Night theme for nighttime
    } else if (hour < 18) {
      setCurrentTheme(theme.day); // Day theme for daytime
    } else {
      setCurrentTheme(theme.night); // Default to night theme
    }
  };

  useEffect(() => {
    // Optionally, you can add functionality to save the user's theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
    }
  }, []);

  const value = { currentTheme, updateTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider; // Ensure this is a default export
