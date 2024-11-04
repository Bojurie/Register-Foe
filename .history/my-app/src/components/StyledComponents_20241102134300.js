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
      employeesCount: "#FFF9E6",
      electionsCount: "#FFF9E6",
      calendarWidget: "#FFF9E6",
      topicsCount: "#FFF9E6",
      electionList: "#FFF9E6",
      newsWidget: "#FFF9E6",
      messagingDashboard: "#FFF9E6",
      topicWidget: "#FFF9E6",
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
      employeesCount: "#FFF4D6",
      electionsCount: "#FFF4D6",
      calendarWidget: "#FFF4D6",
      topicsCount: "#FFF4D6",
      electionList: "#FFF4D6",
      newsWidget: "#FFF4D6",
      messagingDashboard: "#FFF4D6",
      topicWidget: "#FFF4D6",
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
      employeesCount: "#3C506B",
      electionsCount: "#3C506B",
      calendarWidget: "#3C506B",
      topicsCount: "#3C506B",
      electionList: "#3C506B",
      newsWidget: "#3C506B",
      messagingDashboard: "#3C506B",
      topicWidget: "#3C506B",
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
      employeesCount: "#B0C7D5",
      electionsCount: "#B0C7D5",
      calendarWidget: "#B0C7D5",
      topicsCount: "#B0C7D5",
      electionList: "#B0C7D5",
      newsWidget: "#B0C7D5",
      messagingDashboard: "#B0C7D5",
      topicWidget: "#B0C7D5",
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
      employeesCount: "#FFF8D0",
      electionsCount: "#FFF8D0",
      calendarWidget: "#FFF8D0",
      topicsCount: "#FFF8D0",
      electionList: "#FFF8D0",
      newsWidget: "#FFF8D0",
      messagingDashboard: "#FFF8D0",
      topicWidget: "#FFF8D0",
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
      employeesCount: "#2591c6",
      electionsCount: "#2591c6",
      calendarWidget: "#2591c6",
      topicsCount: "#2591c6",
      electionList: "#2591c6",
      newsWidget: "#2591c6",
      messagingDashboard: "#2591c6",
      topicWidget: "#2591c6",
      testimonyHeading: "#2591c6",
      companyDashboardButton: "#2591c6",
      pastElections: "#2591c6",
      adminUserList: "#2591c6",
      userProfile: "#2591c6",
    },
    iconSize: "50px",
  },
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
`;


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.morning);
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

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(JSON.parse(storedTheme));
    }
  }, []);

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

export const EmployeesCountContainer = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.componentStyles.employeesCountContainer.background};
  color: ${({ theme }) => theme.componentStyles.employeesCountContainer.color};
  padding: ${({ theme }) =>
    theme.componentStyles.employeesCountContainer.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.employeesCountContainer.borderRadius};
`;

export const ElectionsCountContainer = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.componentStyles.electionsCountContainer.background};
  color: ${({ theme }) => theme.componentStyles.electionsCountContainer.color};
  padding: ${({ theme }) =>
    theme.componentStyles.electionsCountContainer.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.electionsCountContainer.borderRadius};
`;

export const CalendarWidget = styled(ContainerStyles)`
  background: ${({ theme }) => theme.componentStyles.calendarWidget.background};
  color: ${({ theme }) => theme.componentStyles.calendarWidget.color};
  padding: ${({ theme }) => theme.componentStyles.calendarWidget.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.calendarWidget.borderRadius};
`;

export const TopicsCountContainer = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.componentStyles.topicsCountContainer.background};
  color: ${({ theme }) => theme.componentStyles.topicsCountContainer.color};
  padding: ${({ theme }) => theme.componentStyles.topicsCountContainer.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.topicsCountContainer.borderRadius};
`;

export const ElectionListWrapper = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.componentStyles.ElectionListWrapper.background};
  color: ${({ theme }) => theme.componentStyles.ElectionListWrapper.color};
  padding: ${({ theme }) => theme.componentStyles.ElectionListWrapper.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.ElectionListWrapper.borderRadius};
`;

export const NewsWidgetWrapper = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.componentStyles.NewsWidgetWrapper.background};
  color: ${({ theme }) => theme.componentStyles.NewsWidgetWrapper.color};
  padding: ${({ theme }) => theme.componentStyles.NewsWidgetWrapper.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.NewsWidgetWrapper.borderRadius};
`;

export const MessagingDashboardContainer = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.componentStyles.MessagingDashboardContainer.background};
  color: ${({ theme }) =>
    theme.componentStyles.MessagingDashboardContainer.color};
  padding: ${({ theme }) =>
    theme.componentStyles.MessagingDashboardContainer.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.MessagingDashboardContainer.borderRadius};
`;

export const TopicWidgetWrapper = styled(ContainerStyles)`
  background: ${({ theme }) =>
    theme.componentStyles.TopicWidgetWrapper.background};
  color: ${({ theme }) => theme.componentStyles.TopicWidgetWrapper.color};
  padding: ${({ theme }) => theme.componentStyles.TopicWidgetWrapper.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.TopicWidgetWrapper.borderRadius};
`;

export const TestimonyHeading = styled.h2`
  color: ${({ theme }) => theme.componentStyles.testimonyHeading.color};
  font-size: ${({ theme }) => theme.componentStyles.testimonyHeading.fontSize};
`;

export const PastElections = styled(ContainerStyles)`
  background: ${({ theme }) => theme.componentStyles.PastElections.background};
  color: ${({ theme }) => theme.componentStyles.PastElections.color};
  padding: ${({ theme }) => theme.componentStyles.PastElections.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.PastElections.borderRadius};
`;

export const AdminUserList = styled(ContainerStyles)`
  background: ${({ theme }) => theme.componentStyles.AdminUserList.background};
  color: ${({ theme }) => theme.componentStyles.AdminUserList.color};
  padding: ${({ theme }) => theme.componentStyles.AdminUserList.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.AdminUserList.borderRadius};
`;

export const UserProfile = styled(ContainerStyles)`
  background: ${({ theme }) => theme.componentStyles.UserProfile.background};
  color: ${({ theme }) => theme.componentStyles.UserProfile.color};
  padding: ${({ theme }) => theme.componentStyles.UserProfile.padding};
  border-radius: ${({ theme }) =>
    theme.componentStyles.UserProfile.borderRadius};
`;