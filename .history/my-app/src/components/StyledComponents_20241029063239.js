import React, { createContext, useContext } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components"; // Add createGlobalStyle import

export const theme = {
  default: {
    background: "#ffffff",
    color: "#000000",
    button: {
      background: "#007bff",
      color: "#ffffff",
      hoverBackground: "#0056b3",
    },
    headingColor: "#333333",
  },
};

const ThemeContext = createContext(theme.default);

export const ThemeProvider = ({ theme, children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </StyledThemeProvider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

// Define global styles using createGlobalStyle
export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.color};
    font-family: Arial, sans-serif; // Customize your global font here
  }
`;

export const Container = styled.div`
  /* Container styles */
`;

export const Header = styled.header`
  /* Header styles */
`;
