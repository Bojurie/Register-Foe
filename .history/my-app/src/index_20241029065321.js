// index.js
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import App from "./App";
import store from "./store";
import {
  ThemeProvider,
  GlobalStyle,
  theme,
} from "./components/StyledComponents"; // Ensure this is the correct path
import { AuthProvider } from "./components/AuthContext/AuthContext"; // Ensure this is imported correctly

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme.default}>
              {" "}
              {/* Ensure you're passing the correct theme */}
              <GlobalStyle />
              <App />
            </ThemeProvider>
          </SnackbarProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
