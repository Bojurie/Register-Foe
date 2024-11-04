import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("day"); // Default to 'day'

  const updateTheme = (weather) => {
    if (weather === "night") {
      setTheme("night");
    } else if (weather === "cloudy") {
      setTheme("cloudy");
    } else {
      setTheme("day");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
