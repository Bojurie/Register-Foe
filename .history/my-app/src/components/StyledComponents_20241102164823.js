import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

// Define theme objects
export const themes = {
  morning: {
    background: "#f8f9fc",
    color: "#333",
    headingColor: "#818167",
    iconColor: "#FFA500",
    linkColor: "#FF8C00",
    fontSize: "1rem",
    button: {
      background: "#a32028",
      color: "#f8f9fc",
      hoverBackground: "#FFB84D",
      border: "2px solid #f8f9fc",
      borderRadius: "5px",
    },
    containerBackgrounds: {
      formContainer: "#FFEECC",
      contactContainer: "#FFE4B5",
      stat: "#FFDAB9",
      loginContainer: "#FFD59A",
      container: "#FFF2D6",
      employeesCountContainer: "#FFF9E6",
      electionsCountContainer: "#FFF9E6",
      calendarWidget: "#FFF9E6",
      topicsCountContainer: "#FFF9E6",
      electionListWrapper: "#FFF9E6",
      newsWidgetWrapper: "#FFF9E6",
      messagingDashboardContainer: "#FFF9E6",
      topicWidgetWrapper: "#FFF9E6",
      testimonyHeading: "#FFF9E6",
      companyDashboardButton: "#FFF9E6",
      pastElections: "#FFF9E6",
      adminUserList: "#FFF9E6",
      userProfile: "#FFF9E6",
    },
    iconSize: "50px",
  },
  afternoon: {
    background: "linear-gradient(to right, #FFDB58, #FF8C00)",
    color: "#333",
    headingColor: "#333",
    iconColor: "#FF8C00",
    linkColor: "#FF4500",
    fontSize: "1.1rem",
    button: {
      background: "#FF8C00",
      color: "#fff",
      hoverBackground: "#FFA07A",
      border: "2px solid #FFD700",
      borderRadius: "5px",
    },
    containerBackgrounds: {
      formContainer: "#FFEBCB",
      contactContainer: "#FFDEAD",
      stat: "#FFEC8B",
      loginContainer: "#FFE4B5",
      container: "#FFFCDF",
      employeesCountContainer: "#FFF4D6",
      electionsCountContainer: "#FFF4D6",
      calendarWidget: "#FFF4D6",
      topicsCountContainer: "#FFF4D6",
      electionListWrapper: "#FFF4D6",
      newsWidgetWrapper: "#FFF4D6",
      messagingDashboardContainer: "#FFF4D6",
      topicWidgetWrapper: "#FFF4D6",
      testimonyHeading: "#FFF4D6",
      companyDashboardButton: "#FFF4D6",
      pastElections: "#FFF4D6",
      adminUserList: "#FFF4D6",
      userProfile: "#FFF4D6",
    },
    iconSize: "50px",
  },
  night: {
    background: `url("https://images.unsplash.com/photo-1472552944129-b035e9ea3744?q=80&w=2304&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D") no-repeat center center fixed`,
    backgroundSize: "cover",
    color: "#b39f7c",
    headingColor: "#b39f7c",
    iconColor: "#4B0082",
    linkColor: "#8A2BE2",
    fontSize: ".9rem",
    button: {
      background: "#b39f7c",
      color: "#2f4763",
      hoverBackground: "#6A0DAD",
      border: "2px solid #8A2BE2",
      borderRadius: "5px",
    },
    containerBackgrounds: {
      formContainer: "#3A4B6E",
      contactContainer: "#4B597C",
      stat: "#3C506B",
      loginContainer: "#5A6884",
      container: "#6F798E",
      employeesCountContainer: "#3C506B",
      electionsCountContainer: "#3C506B",
      calendarWidget: "#3C506B",
      topicsCountContainer: "#3C506B",
      electionListWrapper: "#3C506B",
      newsWidgetWrapper: "#3C506B",
      messagingDashboardContainer: "#3C506B",
      topicWidgetWrapper: "#3C506B",
      testimonyHeading: "#3C506B",
      companyDashboardButton: "#3C506B",
      pastElections: "#3C506B",
      adminUserList: "#3C506B",
      userProfile: "#3C506B",
    },
    iconSize: "50px",
  },
  rainy: {
    background: "linear-gradient(to right, #A9C1D5, #A2B4C2)",
    color: "#2F3E46",
    headingColor: "#1A1A2E",
    iconColor: "#2F3E46",
    linkColor: "#A2B4C2",
    fontSize: "1rem",
    button: {
      background: "#2F3E46",
      color: "#FFFFFF",
      hoverBackground: "#3D5B78",
      border: "2px solid #A9C1D5",
      borderRadius: "5px",
    },
    containerBackgrounds: {
      formContainer: "#D8E6EE",
      contactContainer: "#C5D7E0",
      stat: "#B0C7D5",
      loginContainer: "#A2B4C2",
      container: "#CCDCE6",
      employeesCountContainer: "#B0C7D5",
      electionsCountContainer: "#B0C7D5",
      calendarWidget: "#B0C7D5",
      topicsCountContainer: "#B0C7D5",
      electionListWrapper: "#B0C7D5",
      newsWidgetWrapper: "#B0C7D5",
      messagingDashboardContainer: "#B0C7D5",
      topicWidgetWrapper: "#B0C7D5",
      testimonyHeading: "#B0C7D5",
      companyDashboardButton: "#B0C7D5",
      pastElections: "#B0C7D5",
      adminUserList: "#B0C7D5",
      userProfile: "#B0C7D5",
    },
    iconSize: "50px",
  },
  sunny: {
    background: "linear-gradient(to right, #FFD700, #FFA500)",
    color: "#333",
    headingColor: "#333",
    iconColor: "#FFA500",
    linkColor: "#FF4500",
    fontSize: "1.2rem",
    button: {
      background: "#FFA500",
      color: "#595948",
      hoverBackground: "#FFB84D",
      border: "2px solid #FFD700",
      borderRadius: "5px",
    },
    containerBackgrounds: {
      formContainer: "#FFF2B2",
      contactContainer: "#FFEBAA",
      stat: "#FFF8D0",
      loginContainer: "#FFF0B8",
      container: "#FFF9D8",
      employeesCountContainer: "#FFF8D0",
      electionsCountContainer: "#FFF8D0",
      calendarWidget: "#FFF8D0",
      topicsCountContainer: "#FFF8D0",
      electionListWrapper: "#FFF8D0",
      newsWidgetWrapper: "#FFF8D0",
      messagingDashboardContainer: "#FFF8D0",
      topicWidgetWrapper: "#FFF8D0",
      testimonyHeading: "#FFF8D0",
      companyDashboardButton: "#FFF8D0",
      pastElections: "#FFF8D0",
      adminUserList: "#FFF8D0",
      userProfile: "#FFF8D0",
    },
    iconSize: "50px",
  },
  clearSky: {
    background: "#87CEEB",
    color: "#a6b2be",
    headingColor: "#333",
    iconColor: "#FFA500",
    linkColor: "#4682B4",
    fontSize: "1rem",
    button: {
      background: "#4682B4",
      color: "#fff",
      hoverBackground: "#5A9BD3",
      border: "2px solid #87CEEB",
      borderRadius: "5px",
    },
    containerBackgrounds: {
      formContainer: "#2591c6",
      contactContainer: "#2591c6",
      stat: "#2591c6",
      loginContainer: "#2591c6",
      container: "",
      employeesCountContainer: "#2591c6",
      electionsCountContainer: "#2591c6",
      calendarWidget: "#2591c6",
      topicsCountContainer: "#2591c6",
      electionListWrapper: "#2591c6",
      newsWidgetWrapper: "#2591c6",
      messagingDashboardContainer: "#2591c6",
      topicWidgetWrapper: "#2591c6",
      testimonyHeading: "#2591c6",
      companyDashboardButton: "#2591c6",
      pastElections: "#2591c6",
      adminUserList: "#2591c6",
      userProfile: "#2591c6",
    },
    iconSize: "50px",
  },
};

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    font-size: ${({ theme }) => theme.fontSize};
  }
`;

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.morning);

  // Function to update the theme based on weather description and current hour
  const updateTheme = (weatherDescription, currentHour) => {
    try {
      if (weatherDescription.includes("sunny")) {
        setTheme(themes.sunny);
      } else if (weatherDescription.includes("rain")) {
        setTheme(themes.rainy);
      } else {
        // Default theme based on time
        if (currentHour < 0 || currentHour > 23) {
          console.error("Invalid currentHour value:", currentHour);
          setTheme(themes.morning); // Fallback to morning if the hour is invalid
        } else if (currentHour < 12) {
          setTheme(themes.morning);
        } else if (currentHour < 18) {
          setTheme(themes.afternoon);
        } else {
          setTheme(themes.night);
        }
      }
    } catch (error) {
      console.error("Error updating theme:", error);
      setTheme(themes.morning); // Fallback in case of error
    }
  };

  // Function to toggle between themes
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      return prevTheme === themes.morning ? themes.night : themes.morning;
    });
  };

  // Provide the context with theme, setTheme, updateTheme, and toggleTheme
  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, updateTheme, toggleTheme }}
    >
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Styled button component
const StyledButton = styled.button`
  background: ${({ theme, disabled }) =>
    disabled ? "#ccc" : theme.button.background};
  color: ${({ theme, disabled }) => (disabled ? "#666" : theme.button.color)};
  border: ${({ theme }) => theme.button.border};
  border-radius: ${({ theme }) => theme.button.borderRadius};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  padding: 10px 20px;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme, disabled }) =>
      disabled ? "#ccc" : theme.button.hoverBackground};
  }

  &:active {
    transform: translateY(0);
  }
`;

// Exported button component
export const Button = ({ children, disabled = false, ...props }) => {
  return (
    <StyledButton disabled={disabled} {...props}>
      {children}
    </StyledButton>
  );
};

// Styled container components
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

export const FormContainerWrapper = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.formContainer};
`;

export const ContactContainer = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.contactContainer};
`;

export const LoginContainer = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.loginContainer};
`;
export const EmployeesCountContainer = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.containerBackgrounds.employeesCountContainer};
`;
export const ElectionsCountContainer = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.containerBackgrounds.electionsCountContainer};
`;
export const TopicsCountContainer = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.topicsCountContainer};
`;
export const Widget = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.calendarWidget};
`;
export const ElectionListWrapper = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.electionListWrapper};
`;
export const NewsWidgetWrapper = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.newsWidgetWrapper};
`;
export const TopicWidgetWrapper = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.topicWidgetWrapper};
`;
export const MessagingDashboardContainer = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.containerBackgrounds.messagingDashboardContainer};
`;
export const TestimonyHeading = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.testimonyHeading};
`;
export const CompanyDashboardButton = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.containerBackgrounds.companyDashboardButton};
`;
export const UserProfileWrapper = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.userProfile};
`;
export const AdminUserList = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.adminUserList};
`;
export const PastElectionsWrapper= styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.pastElections};
`;
