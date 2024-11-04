import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    transition: background-color 0.5s, color 0.5s;
    background-color: ${({ theme }) =>
      theme === "day" ? "#87CEEB" : theme === "night" ? "#2C3E50" : "#B0C4DE"};
    color: ${({ theme }) => (theme === "day" ? "#000" : "#fff")};
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
  color: ${({ theme }) => (theme === "day" ? "#333" : "#fff")};
`;
