import React, { createContext, useContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to 'day' theme
    const storedTheme = localStorage.getItem("currentTheme");
    return storedTheme ? JSON.parse(storedTheme) : themes.day;
  });

  const updateTheme = (weatherIcon, hour) => {
    let selectedTheme = themes.day; // Default theme

    if (hour >= 6 && hour < 18) {
      switch (weatherIcon) {
        case "01d": // Clear sky
          selectedTheme = themes.sunny;
          break;
        case "02d":
        case "03d":
        case "04d": // Cloudy
          selectedTheme = themes.cloudy;
          break;
        case "09d":
        case "10d": // Rainy
          selectedTheme = themes.rainy;
          break;
        case "13d": // Snow
          selectedTheme = themes.snowy;
          break;
        case "50d": // Mist (Rainforest-like theme)
          selectedTheme = themes.rainforest;
          break;
        default:
          selectedTheme = themes.day;
          break;
      }
    } else {
      selectedTheme = themes.night;
    }

    setTheme(selectedTheme);
  };

  // Persist theme in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentTheme", JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

// Default theme object for easy maintenance
const themes = {
  day: {
    background: "#87CEEB",
    color: "#000",
    button: {
      background: "#FFD700",
      color: "#000",
      hoverBackground: "#FFEC8B",
    },
    headingColor: "#333",
  },
  night: {
    background: "#2C3E50",
    color: "#fff",
    button: {
      background: "#5b0b0b",
      color: "#fff",
      hoverBackground: "#9c3c3c",
    },
    headingColor: "#fff",
  },
  sunny: {
    background: "#FFFAE3",
    color: "#333",
    button: {
      background: "#FFA500",
      color: "#333",
      hoverBackground: "#FFD580",
    },
    headingColor: "#555",
  },
  cloudy: {
    background: "#B0C4DE",
    color: "#333",
    button: {
      background: "#778899",
      color: "#fff",
      hoverBackground: "#A9A9A9",
    },
    headingColor: "#333",
  },
  rainy: {
    background: "#7F8C8D",
    color: "#fff",
    button: {
      background: "#34495E",
      color: "#fff",
      hoverBackground: "#2C3E50",
    },
    headingColor: "#fff",
  },
  snowy: {
    background: "#E6E6FA",
    color: "#333",
    button: {
      background: "#4682B4",
      color: "#fff",
      hoverBackground: "#5F9EA0",
    },
    headingColor: "#333",
  },
  rainforest: {
    background: "#0B3D0B",
    color: "#E6E6E6",
    button: {
      background: "#228B22",
      color: "#fff",
      hoverBackground: "#2E8B57",
    },
    headingColor: "#D3D3D3",
  },
};
