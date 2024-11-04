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
    iconColor: "#FFA500", // Match icon color to the button
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#FFA500", textDecoration: "none" },
    },
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
    iconColor: "#4B0082", // Indigo for icons
    typography: {
      h1: { color: "#EAEAEA", fontSize: "2.5rem" },
      h2: { color: "#EAEAEA", fontSize: "2rem" },
      h3: { color: "#EAEAEA", fontSize: "1.75rem" },
      h4: { color: "#EAEAEA", fontSize: "1.5rem" },
      h5: { color: "#EAEAEA", fontSize: "1.25rem" },
      p: { color: "#EAEAEA", fontSize: "1rem" },
      a: { color: "#D8BFD8", textDecoration: "underline" },
    },
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
    iconColor: "#778899", // Gray for icons
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#333", textDecoration: "none" },
    },
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
    iconColor: "#4682B4", // Steel blue for icons
    typography: {
      h1: { color: "#EAEAEA", fontSize: "2.5rem" },
      h2: { color: "#EAEAEA", fontSize: "2rem" },
      h3: { color: "#EAEAEA", fontSize: "1.75rem" },
      h4: { color: "#EAEAEA", fontSize: "1.5rem" },
      h5: { color: "#EAEAEA", fontSize: "1.25rem" },
      p: { color: "#EAEAEA", fontSize: "1rem" },
      a: { color: "#fff", textDecoration: "underline" },
    },
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
    iconColor: "#F0E68C", // Khaki for icons
    typography: {
      h1: { color: "#fff", fontSize: "2.5rem" },
      h2: { color: "#fff", fontSize: "2rem" },
      h3: { color: "#fff", fontSize: "1.75rem" },
      h4: { color: "#fff", fontSize: "1.5rem" },
      h5: { color: "#fff", fontSize: "1.25rem" },
      p: { color: "#fff", fontSize: "1rem" },
      a: { color: "#F0E68C", textDecoration: "underline" },
    },
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
    iconColor: "#87CEFA", // Light sky blue for icons
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#87CEFA", textDecoration: "underline" },
    },
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
    iconColor: "#B0C4DE", // Light steel blue for icons
    typography: {
      h1: { color: "#333", fontSize: "2.5rem" },
      h2: { color: "#333", fontSize: "2rem" },
      h3: { color: "#333", fontSize: "1.75rem" },
      h4: { color: "#333", fontSize: "1.5rem" },
      h5: { color: "#333", fontSize: "1.25rem" },
      p: { color: "#333", fontSize: "1rem" },
      a: { color: "#333", textDecoration: "none" },
    },
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
    iconColor: "#A9A9A9", // Dark gray for icons
    typography: {
      h1: { color: "#EAEAEA", fontSize: "2.5rem" },
      h2: { color: "#EAEAEA", fontSize: "2rem" },
      h3: { color: "#EAEAEA", fontSize: "1.75rem" },
      h4: { color: "#EAEAEA", fontSize: "1.5rem" },
      h5: { color: "#EAEAEA", fontSize: "1.25rem" },
      p: { color: "#EAEAEA", fontSize: "1rem" },
      a: { color: "#fff", textDecoration: "underline" },
    },
  },
  windy: {
    background: "#00CED1", // Dark turquoise
    color: "#fff", // Light text for contrast
    button: {
      background: "#20B2AA", // Light sea green
      color: "#fff",
      hoverBackground: "#3CB371", // Medium sea green
    },
    headingColor: "#fff",
    iconColor: "#20B2AA", // Light sea green for icons
    typography: {
      h1: { color: "#fff", fontSize: "2.5rem" },
      h2: { color: "#fff", fontSize: "2rem" },
      h3: { color: "#fff", fontSize: "1.75rem" },
      h4: { color: "#fff", fontSize: "1.5rem" },
      h5: { color: "#fff", fontSize: "1.25rem" },
      p: { color: "#fff", fontSize: "1rem" },
      a: { color: "#20B2AA", textDecoration: "underline" },
    },
  },
};

// Create a ThemeContext to provide theme information throughout the application
const ThemeContext = createContext();

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay); // Default theme

  const toggleTheme = (themeName) => {
    setCurrentTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook for using the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Example of how to apply the theme styles in a component
const ThemedComponent = () => {
  const { currentTheme } = useTheme();

  return (
    <div
      style={{
        background: currentTheme.background,
        color: currentTheme.color,
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h1 style={currentTheme.typography.h1}>Weather App</h1>
      <h2 style={currentTheme.typography.h2}>Today's Weather</h2>
      <p style={currentTheme.typography.p}>It looks sunny today!</p>
      <a href="#more-info" style={currentTheme.typography.a}>
        More Info
      </a>
      <button
        style={{
          background: currentTheme.button.background,
          color: currentTheme.button.color,
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background =
            currentTheme.button.hoverBackground)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = currentTheme.button.background)
        }
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemedComponent;
