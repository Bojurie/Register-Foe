import React, { createContext, useContext, useState, useEffect } from "react";
import { theme } from "./StyledComponents"; // Ensure this path is correct

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

const ThemeProvider = ({ children }) => {
  // Set initial theme to the default theme
  const [currentTheme, setCurrentTheme] = useState(theme.default);

  // Function to update theme based on weather icon and current hour
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
    // Load saved theme from localStorage if available
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      try {
        setCurrentTheme(JSON.parse(savedTheme)); // Parse the saved theme
      } catch (error) {
        console.error("Failed to load theme from localStorage:", error);
        // Fall back to default theme on error
        setCurrentTheme(theme.default);
      }
    }
  }, []);

  // Update localStorage whenever currentTheme changes
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(currentTheme));
  }, [currentTheme]);

  const value = { currentTheme, updateTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider; // Ensure this is a default export
