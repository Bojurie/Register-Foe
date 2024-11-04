import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    transition: background 0.5s ease, color 0.5s ease;
  }
`;

export default GlobalStyle;
