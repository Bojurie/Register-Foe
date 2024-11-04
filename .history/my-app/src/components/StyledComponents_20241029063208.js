import React, { createContext, useContext } from "react";
import styled, {
  ThemeProvider as StyledThemeProvider,
} from "styled-components";

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

// Export your styled components
export const GlobalStyle = createGlobalStyle`
  /* Global styles */
`;

export const Container = styled.div`
  /* Container styles */
`;

export const Header = styled.header`
  /* Header styles */
`;
