import React, { createContext, useContext, useState, useEffect } from "react";

// Define a variety of themes to match different weather conditions
const themes = {
  clearDay: {
    background: "#FFD580", // Warm, sunny yellow
    color: "#333", // Dark text for contrast
    button: {
      background: "#FFA500", // Bright orange
      color: "#333",
      hoverBackground: "#FFEC8B", // Light golden yellow
    },
    headingColor: "#333",
  },
  clearNight: {
    background: "#2B2B52", // Deep night blue
    color: "#EAEAEA", // Light text for readability
    button: {
      background: "#4B0082", // Indigo
      color: "#fff",
      hoverBackground: "#551A8B", // Darker indigo
    },
    headingColor: "#D8BFD8",
  },
  cloudy: {
    background: "#A9A9A9", // Dark gray
    color: "#333",
    button: {
      background: "#778899", // Slate gray
      color: "#fff",
      hoverBackground: "#A9A9A9",
    },
    headingColor: "#333",
  },
  rainy: {
    background: "#5F9EA0", // Cadet blue for rainy days
    color: "#EAEAEA", // Light text for readability
    button: {
      background: "#4682B4", // Steel blue
      color: "#fff",
      hoverBackground: "#2C3E50", // Dark blue
    },
    headingColor: "#fff",
  },
  stormy: {
    background: "#2F4F4F", // Dark slate gray
    color: "#fff", // White text for contrast
    button: {
      background: "#696969", // Dim gray
      color: "#fff",
      hoverBackground: "#4B4B4B", // Darker gray
    },
    headingColor: "#F0E68C", // Khaki
  },
  snowy: {
    background: "#F0F8FF", // Alice blue for a snowy look
    color: "#333",
    button: {
      background: "#87CEFA", // Light sky blue
      color: "#333",
      hoverBackground: "#ADD8E6", // Lighter sky blue
    },
    headingColor: "#333",
  },
  misty: {
    background: "#E0E0E0", // Light gray for mist
    color: "#333",
    button: {
      background: "#B0C4DE", // Light steel blue
      color: "#333",
      hoverBackground: "#D3D3D3", // Lighter gray
    },
    headingColor: "#333",
  },
  foggy: {
    background: "#696969", // Dim gray
    color: "#EAEAEA", // Light text for readability
    button: {
      background: "#A9A9A9", // Dark gray
      color: "#fff",
      hoverBackground: "#808080", // Medium gray
    },
    headingColor: "#fff",
  },
  hail: {
    background: "#E0FFFF", // Light cyan
    color: "#333",
    button: {
      background: "#5F9EA0", // Cadet blue
      color: "#333",
      hoverBackground: "#4682B4", // Steel blue
    },
    headingColor: "#333",
  },
  thunderstorm: {
    background: "#4B0082", // Dark indigo for a dramatic storm effect
    color: "#EAEAEA",
    button: {
      background: "#800080", // Purple
      color: "#fff",
      hoverBackground: "#4B0082", // Dark indigo
    },
    headingColor: "#FFD700", // Gold for contrast
  },
  default: {
    background: "#87CEEB", // Sky blue
    color: "#000",
    button: {
      background: "#FFD700", // Gold
      color: "#000",
      hoverBackground: "#FFEC8B", // Lighter gold
    },
    headingColor: "#333",
  },
};

// Create the ThemeContext for use throughout the app
export const ThemeContext = createContext();

// ThemeProvider component to provide theme state
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.default);

  const updateTheme = (weatherIcon, hour) => {
    let selectedTheme = themes.default; // Default theme

    // Choose theme based on weather icon and time of day
    if (hour >= 6 && hour < 18) {
      switch (weatherIcon) {
        case "01d": // Clear sky
          selectedTheme = themes.clearDay;
          break;
        case "02d":
        case "03d":
        case "04d": // Cloudy variations
          selectedTheme = themes.cloudy;
          break;
        case "09d":
        case "10d": // Rain
          selectedTheme = themes.rainy;
          break;
        case "11d": // Thunderstorm
          selectedTheme = themes.thunderstorm;
          break;
        case "13d": // Snow
          selectedTheme = themes.snowy;
          break;
        case "50d": // Mist/fog
          selectedTheme = themes.misty;
          break;
        default:
          selectedTheme = themes.default;
          break;
      }
    } else {
      // Night-specific themes
      selectedTheme = themes.clearNight;
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

// Custom hook for easy access to theme
export const useTheme = () => {
  return useContext(ThemeContext);
};
