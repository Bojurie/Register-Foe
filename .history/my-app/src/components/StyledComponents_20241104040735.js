import React, { createContext, useContext, useEffect, useState } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";

// Define theme objects
export const themes = {
  morning: {
    background: "#2489a6",
    color: "#9fb1bbe3",
    headingColor: "#9fb1bbe3",
    iconColor: "#FFA500",
    linkColor: "#FF8C00",
    fontSize: "1rem",
    button: {
      background: "#2688a6",
      color: "#2688a6",
      hoverBackground: "#9fb1bbe3",
      borderRadius: "5px",
    },
    containerBackgrounds: {
      formContainer: "#145163c2",
      contactContainer: "#145163c2",
      stat: "#145163c2",
      loginContainer: "#145163c2",
      container: "#145163c2",
      employeesCountContainer: "#145163c2",
      electionsCountContainer: "#145163c2",
      calendarWidget: "#145163c2",
      topicsCountContainer: "#145163c2",
      electionListWrapper: "#145163c2",
      newsWidgetWrapper: "#145163c2",
      messagingDashboardContainer: "#145163c2",
      topicWidgetWrapper: "#145163c2",
      testimonyHeading: "#145163c2",
      companyDashboardButton: "#145163c2",
      pastElections: "#145163c2",
      adminUserList: "#145163c2",
      userProfile: "#145163c2",
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
    background: "linear-gradient(to right, #A9C1D5, #2f4763)",
    color: "#ede8e8cf",
    headingColor: "#ede8e8cf",
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
      formContainer: "#3c506bb5",
      contactContainer: "#3c506bb5",
      stat: "#3c506bb5",
      loginContainer: "#3c506bb5",
      container: "#3c506bb5",
      employeesCountContainer: "#3c506bb5",
      electionsCountContainer: "#3c506bb5",
      calendarWidget: "#3c506bb5",
      topicsCountContainer: "#3c506bb5",
      electionListWrapper: "#3c506bb5",
      newsWidgetWrapper: "#3c506bb5",
      messagingDashboardContainer: "#3c506bb5",
      topicWidgetWrapper: "#3c506bb5",
      testimonyHeading: "#3c506bb5",
      companyDashboardButton: "#3c506bb5",
      pastElections: "#3c506bb5",
      adminUserList: "#3c506bb5",
      userProfile: "#3c506bb5",
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
box-shadow: 0px 4px 12px rgb(246 252 255 / 93%);
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
export const AdminUserListWrapper = styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.adminUserList};
`;
export const PastElectionsWrapper= styled(ContainerStyles)`
  background: ${({ theme }) => theme.containerBackgrounds.pastElections};
`;
