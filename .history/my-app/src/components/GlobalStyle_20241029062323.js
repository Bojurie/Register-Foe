// GlobalStyles.js
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background || "#fff"};
    color: ${({ theme }) => theme.color || "#000"};
    font-family: 'Roboto', sans-serif;
    margin: 0;
    transition: background-color 0.3s ease, color 0.3s ease; // Smooth transition
  }
`;
