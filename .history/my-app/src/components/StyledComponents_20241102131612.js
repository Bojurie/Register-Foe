import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

// Define theme objects
const lightTheme = {
  background: "#ffffff",
  color: "#333333",
  headingColor: "#1a1a1a",
  fontSize: "16px",
  linkColor: "#007bff",
  containerBackgrounds: {
    container: "#f9f9f9",
  },
  button: {
    background: "#007bff",
    color: "#ffffff",
    border: "1px solid #007bff",
    borderRadius: "5px",
    hoverBackground: "#0056b3",
  },
  componentStyles: {
    employeesCountContainer: {
      background: "#e3f2fd", // Light blue
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    electionsCountContainer: {
      background: "#fffde7", // Light yellow
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    calendarWidget: {
      background: "#f1f8e9", // Light green
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    topicsCountContainer: {
      background: "#f3e5f5", // Light purple
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    ElectionListWrapper: {
      background: "#e0f7fa", // Light teal
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    NewsWidgetWrapper: {
      background: "#fff3e0", // Light orange
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    MessagingDashboardContainer: {
      background: "#e8f5e9", // Light green
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    TopicWidgetWrapper: {
      background: "#ffebee", // Light red
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    testimonyHeading: {
      color: "#333333",
      fontSize: "1.5rem",
    },
    PastElections: {
      background: "#f9fbe7", // Light lime
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    AdminUserList: {
      background: "#e8eaf6", // Light indigo
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    UserProfile: {
      background: "#e1f5fe", // Light blue
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
  },
};

const darkTheme = {
  background: "#121212",
  color: "#ffffff",
  headingColor: "#ffffff",
  fontSize: "16px",
  linkColor: "#90caf9",
  containerBackgrounds: {
    container: "#1e1e1e",
  },
  button: {
    background: "#90caf9",
    color: "#121212",
    border: "1px solid #90caf9",
    borderRadius: "5px",
    hoverBackground: "#64b5f6",
  },
  componentStyles: {
    employeesCountContainer: {
      background: "#424242", // Dark grey
      color: "#e0e0e0",
      padding: "20px",
      borderRadius: "8px",
    },
    electionsCountContainer: {
      background: "#424242", // Dark grey
      color: "#e0e0e0",
      padding: "20px",
      borderRadius: "8px",
    },
    calendarWidget: {
      background: "#263238", // Dark blue-grey
      color: "#e0e0e0",
      padding: "20px",
      borderRadius: "8px",
    },
    topicsCountContainer: {
      background: "#303f9f", // Dark indigo
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
    ElectionListWrapper: {
      background: "#1b5e20", // Dark green
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
    NewsWidgetWrapper: {
      background: "#d84315", // Dark orange
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
    MessagingDashboardContainer: {
      background: "#00695c", // Dark teal
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
    TopicWidgetWrapper: {
      background: "#880e4f", // Dark pink
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
    testimonyHeading: {
      color: "#f5f5f5",
      fontSize: "1.5rem",
    },
    PastElections: {
      background: "#2e7d32", // Dark lime
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
    AdminUserList: {
      background: "#4a148c", // Dark purple
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
    UserProfile: {
      background: "#1a237e", // Dark blue
      color: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
    },
  },
};

const weatherTheme = {
  background: "#e0f7fa", // Sky blue
  color: "#00695c", // Dark teal
  headingColor: "#004d40",
  fontSize: "16px",
  linkColor: "#00796b",
  containerBackgrounds: {
    container: "#b2ebf2", // Lighter sky blue
  },
  button: {
    background: "#00796b",
    color: "#ffffff",
    border: "1px solid #00796b",
    borderRadius: "5px",
    hoverBackground: "#004d40",
  },
  componentStyles: {
    employeesCountContainer: {
      background: "#b2dfdb", // Light teal
      color: "#004d40",
      padding: "20px",
      borderRadius: "8px",
    },
    electionsCountContainer: {
      background: "#d1c4e9", // Light purple
      color: "#311b92",
      padding: "20px",
      borderRadius: "8px",
    },
    calendarWidget: {
      background: "#ffe082", // Light yellow
      color: "#f57f17",
      padding: "20px",
      borderRadius: "8px",
    },
    topicsCountContainer: {
      background: "#f8bbd0", // Light pink
      color: "#880e4f",
      padding: "20px",
      borderRadius: "8px",
    },
    ElectionListWrapper: {
      background: "#c5cae9", // Light indigo
      color: "#1a237e",
      padding: "20px",
      borderRadius: "8px",
    },
    NewsWidgetWrapper: {
      background: "#ffe0b2", // Light orange
      color: "#ff6f20",
      padding: "20px",
      borderRadius: "8px",
    },
    MessagingDashboardContainer: {
      background: "#c8e6c9", // Light green
      color: "#388e3c",
      padding: "20px",
      borderRadius: "8px",
    },
    TopicWidgetWrapper: {
      background: "#fce4ec", // Light red
      color: "#c2185b",
      padding: "20px",
      borderRadius: "8px",
    },
    testimonyHeading: {
      color: "#00695c",
      fontSize: "1.5rem",
    },
    PastElections: {
      background: "#dcedc8", // Light lime
      color: "#4caf50",
      padding: "20px",
      borderRadius: "8px",
    },
    AdminUserList: {
      background: "#d1c4e9", // Light purple
      color: "#5e35b1",
      padding: "20px",
      borderRadius: "8px",
    },
    UserProfile: {
      background: "#bbdefb", // Light blue
      color: "#0d47a1",
      padding: "20px",
      borderRadius: "8px",
    },
  },
};

const dayTheme = {
  background: "#ffffff", // White for day theme
  color: "#333333", // Dark text
  headingColor: "#000000", // Black heading
  fontSize: "16px",
  linkColor: "#1976d2",
  containerBackgrounds: {
    container: "#f1f1f1", // Light grey
  },
  button: {
    background: "#2196f3",
    color: "#ffffff",
    border: "1px solid #2196f3",
    borderRadius: "5px",
    hoverBackground: "#1976d2",
  },
  componentStyles: {
    employeesCountContainer: {
      background: "#e8f5e9", // Light green
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    electionsCountContainer: {
      background: "#fff3e0", // Light orange
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    calendarWidget: {
      background: "#e3f2fd", // Light blue
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    topicsCountContainer: {
      background: "#f3e5f5", // Light purple
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    ElectionListWrapper: {
      background: "#e0f7fa", // Light teal
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    NewsWidgetWrapper: {
      background: "#fffde7", // Light yellow
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    MessagingDashboardContainer: {
      background: "#c8e6c9", // Light green
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    TopicWidgetWrapper: {
      background: "#ffebee", // Light red
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    testimonyHeading: {
      color: "#000000",
      fontSize: "1.5rem",
    },
    PastElections: {
      background: "#f0f4c3", // Light lime
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    AdminUserList: {
      background: "#e1bee7", // Light purple
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
    UserProfile: {
      background: "#bbdefb", // Light blue
      color: "#333333",
      padding: "20px",
      borderRadius: "8px",
    },
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  weather: weatherTheme,
  day: dayTheme,
};
// Global styles for the application
export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background: ${({ theme }) => theme.background};
    background-size: ${({ theme }) => theme.backgroundSize || "auto"};
    color: ${({ theme }) => theme.color};
    font-size: ${({ theme }) => theme.fontSize};
    transition: background 0.3s, color 0.3s;
  }
    h1 {
    color: ${({ theme }) => theme.headingColor};
  }
  
  h2, h3, h4, h5 {
    color: ${({ theme }) => theme.headingColor};
    font-size: calc(${({ theme }) => theme.fontSize} + 0rem);
  }
  
  a {
    color: ${({ theme }) => theme.linkColor};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  
  p {
    color: ${({ theme }) => theme.color};
    font-size: ${({ theme }) => theme.fontSize};
  }


   .employees-count-container {
    background: ${({ theme }) =>
      theme.componentStyles.employeesCountContainer.background};
    color: ${({ theme }) =>
      theme.componentStyles.employeesCountContainer.color};
    padding: ${({ theme }) =>
      theme.componentStyles.employeesCountContainer.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.employeesCountContainer.borderRadius};
  }

  .elections-count-container {
    background: ${({ theme }) =>
      theme.componentStyles.electionsCountContainer.background};
    color: ${({ theme }) =>
      theme.componentStyles.electionsCountContainer.color};
    padding: ${({ theme }) =>
      theme.componentStyles.electionsCountContainer.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.electionsCountContainer.borderRadius};
  }

  .calendarWidget {
    background: ${({ theme }) =>
      theme.componentStyles.calendarWidget.background};
    color: ${({ theme }) => theme.componentStyles.calendarWidget.color};
    padding: ${({ theme }) => theme.componentStyles.calendarWidget.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.calendarWidget.borderRadius};
  }

  .topics-count-container {
    background: ${({ theme }) =>
      theme.componentStyles.topicsCountContainer.background};
    color: ${({ theme }) => theme.componentStyles.topicsCountContainer.color};
    padding: ${({ theme }) =>
      theme.componentStyles.topicsCountContainer.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.topicsCountContainer.borderRadius};
  }

  .ElectionList-Wrapper {
    background: ${({ theme }) =>
      theme.componentStyles.ElectionListWrapper.background};
    color: ${({ theme }) => theme.componentStyles.ElectionListWrapper.color};
    padding: ${({ theme }) =>
      theme.componentStyles.ElectionListWrapper.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.ElectionListWrapper.borderRadius};
  }

  .NewsWidget-Wrapper {
    background: ${({ theme }) =>
      theme.componentStyles.NewsWidgetWrapper.background};
    color: ${({ theme }) => theme.componentStyles.NewsWidgetWrapper.color};
    padding: ${({ theme }) => theme.componentStyles.NewsWidgetWrapper.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.NewsWidgetWrapper.borderRadius};
  }

  .MessagingDashboard-Container {
    background: ${({ theme }) =>
      theme.componentStyles.MessagingDashboardContainer.background};
    color: ${({ theme }) =>
      theme.componentStyles.MessagingDashboardContainer.color};
    padding: ${({ theme }) =>
      theme.componentStyles.MessagingDashboardContainer.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.MessagingDashboardContainer.borderRadius};
  }

  .TopicWidget-Wrapper {
    background: ${({ theme }) =>
      theme.componentStyles.TopicWidgetWrapper.background};
    color: ${({ theme }) => theme.componentStyles.TopicWidgetWrapper.color};
    padding: ${({ theme }) => theme.componentStyles.TopicWidgetWrapper.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.TopicWidgetWrapper.borderRadius};
  }

  .testimony-heading {
    color: ${({ theme }) => theme.componentStyles.testimonyHeading.color};
    font-size: ${({ theme }) =>
      theme.componentStyles.testimonyHeading.fontSize};
  }

  .PastElections {
    background: ${({ theme }) =>
      theme.componentStyles.PastElections.background};
    color: ${({ theme }) => theme.componentStyles.PastElections.color};
    padding: ${({ theme }) => theme.componentStyles.PastElections.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.PastElections.borderRadius};
  }

  .Admin-User-List {
    background: ${({ theme }) =>
      theme.componentStyles.AdminUserList.background};
    color: ${({ theme }) => theme.componentStyles.AdminUserList.color};
    padding: ${({ theme }) => theme.componentStyles.AdminUserList.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.AdminUserList.borderRadius};
  }

  .UserProfile {
    background: ${({ theme }) => theme.componentStyles.UserProfile.background};
    color: ${({ theme }) => theme.componentStyles.UserProfile.color};
    padding: ${({ theme }) => theme.componentStyles.UserProfile.padding};
    border-radius: ${({ theme }) =>
      theme.componentStyles.UserProfile.borderRadius};
  }
`;


// Create ThemeContext to manage theme state
const ThemeContext = createContext();

// ThemeProvider component to wrap the application
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.morning);

  // Function to update the theme based on weather and time
  const updateTheme = (weatherIcon, hour) => {
    if (hour >= 18 || hour < 6) {
      setTheme(themes.night);
    } else if (weatherIcon.includes("rain")) {
      setTheme(themes.rainy);
    } else if (weatherIcon.includes("clear") && hour >= 6 && hour < 12) {
      setTheme(themes.morning);
    } else if (weatherIcon.includes("clear") && hour >= 12 && hour < 18) {
      setTheme(themes.afternoon);
    } else {
      setTheme(themes.clearSky);
    }
  };

  // Effect to load stored theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(JSON.parse(storedTheme));
    }
  }, []);

  // Effect to save theme to localStorage
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Styled components for buttons and containers
export const Button = styled.button`
  background: ${({ theme }) => theme.button.background};
  color: ${({ theme }) => theme.button.color};
  border: ${({ theme }) => theme.button.border};
  border-radius: ${({ theme }) => theme.button.borderRadius};
  padding: 10px 20px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize};
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: ${({ theme }) => theme.button.hoverBackground};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContainerStyles = styled.div`
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Container = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.container};
`;

export const Stat = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.stat};
  margin-bottom: 10px;
`;

export const FormContainer = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.formContainer};
`;

export const ContactContainer = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.contactContainer};
`;

export const LoginContainer = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.loginContainer};
`;
