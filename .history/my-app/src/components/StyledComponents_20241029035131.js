import React, { useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

// Theme definitions
const theme = {
  day: {
    background: "#87CEEB",
    color: "#000",
    headerColor: "#333",
  },
  night: {
    background: "#2C3E50",
    color: "#fff",
    headerColor: "#fff",
  },
  default: {
    background: "#B0C4DE",
    color: "#000",
    headerColor: "#333",
  },
};

// Global styles
export const GlobalStyle = createGlobalStyle`
  body {
    transition: background-color 0.5s, color 0.5s;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    font-family: 'Roboto', sans-serif;
  }
`;

// Styled components
export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

export const Header = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  transition: color 0.5s;
  color: ${({ theme }) => theme.headerColor};
`;

const App = () => {
  // State to manage current theme
  const [currentTheme, setCurrentTheme] = useState("day");

  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === "day" ? "night" : "day"));
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <GlobalStyle />
      <Container>
        <Header>Weather Widget</Header>
        <button onClick={toggleTheme}>
          Switch to {currentTheme === "day" ? "Night" : "Day"} Theme
        </button>
        {/* Add your weather widget components here */}
      </Container>
    </ThemeProvider>
  );
};

export default App;
