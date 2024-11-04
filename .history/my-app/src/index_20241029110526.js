import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import App from "./App";
import store from "./store";
import { AuthProvider } from "./components/AuthContext/AuthContext";
import { GlobalStyle, ThemeProvider } from "./components/StyledComponents";
import { themes } from "./components/StyledComponents"; // Adjust the path if needed

// Set up the root for React 18
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <SnackbarProvider maxSnack={3}>
            <CustomThemeProvider>
              <GlobalStyle />
              <App />
            </CustomThemeProvider>
          </SnackbarProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// Custom ThemeProvider with time-based theme switching
function CustomThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(themes.clearDay); // Replace with your default theme

  const updateTheme = (hour) => {
    if (hour >= 6 && hour < 18) {
      setCurrentTheme(themes.clearDay); // Use your day theme
    } else {
      setCurrentTheme(themes.clearNight); // Use your night theme
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    updateTheme(hour);
  }, []);

  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
}
