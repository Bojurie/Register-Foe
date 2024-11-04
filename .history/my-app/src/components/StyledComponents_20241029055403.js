import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

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

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    font-family: 'Roboto', sans-serif;
    margin: 0;
  }
`;

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

export const Header = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.headerColor};
`;

export { theme, ThemeProvider };
