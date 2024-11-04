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
    transition: background-color 0.5s, color 0.5s;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    font-family: 'Roboto', sans-serif;
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
  transition: color 0.5s;
  color: ${({ theme }) => theme.headerColor};
`;


const App = () => {
  const currentTheme =

  return (
    <ThemeProvider theme={theme[currentTheme] || theme.default}>
      <GlobalStyle />
      
    </ThemeProvider>
  );
};

export default App;
