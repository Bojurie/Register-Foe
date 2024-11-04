import React, { createContext, useContext, useState, useEffect } from "react";

// Define multiple themes with carefully chosen colors for readability
const themes = {
  day: {
    background: "#87CEEB", // Light blue sky
    color: "#000", // Black text for readability
    button: {
      background: "#FFD700", // Gold
      color: "#000",
      hoverBackground: "#FFEC8B", // Lighter gold
    },
    headingColor: "#333",
  },
  night: {
    background: "#2C3E50", // Dark blue
    color: "#fff", // White text for contrast
    button: {
      background: "#5b0b0b", // Dark red
      color: "#ffffff",
      hoverBackground: "#9c3c3c",
    },
    headingColor: "#fff",
  },
  sunny: {
    background: "#FFFAE3", // Light sunny yellow
    color: "#333", // Dark text for contrast
    button: {
      background: "#FFA500", // Orange
      color: "#333",
      hoverBackground: "#FFD580", // Light orange
    },
    headingColor: "#555",
  },
  cloudy: {
    background: "#B0C4DE", // Light steel blue
    color: "#333",
    button: {
      background: "#778899", // Grayish blue
      color: "#fff",
      hoverBackground: "#A9A9A9", // Dark gray
    },
    headingColor: "#333",
  },
  rainy: {
    background: "#7F8C8D", // Grayish tone
    color: "#fff", // White text for readability
    button: {
      background: "#34495E", // Darker blue-gray
      color: "#fff",
      hoverBackground: "#2C3E50",
    },
    headingColor: "#fff",
  },
  snowy: {
    background: "#E6E6FA", // Lavender
    color: "#333",
    button: {
      background: "#4682B4", // Steel blue
      color: "#fff",
      hoverBackground: "#5F9EA0", // Cadet blue
    },
    headingColor: "#333",
  },
  rainforest: {
    background: "#0B3D0B", // Deep forest green
    color: "#E6E6E6", // Light text for readability
    button: {
      background: "#228B22", // Forest green
      color: "#fff",
      hoverBackground: "#2E8B57", // Sea green
    },
    headingColor: "#D3D3D3",
  },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.day); // Default to 'day'

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
    localStorage.setItem("currentTheme", JSON.stringify(selectedTheme));
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("currentTheme");
    if (storedTheme) {
      setTheme(JSON.parse(storedTheme));
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
