import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import App from "./App";
import store from "./store";
import { AuthProvider } from "./components/AuthContext/AuthContext";

import {
  themes,
  GlobalStyle,
  ThemeProvider,
} from "./components/StyledComponents";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <SnackbarProvider maxSnack={3}>
            <ThemeProvider>
              {" "}
              {/* Wrapping entire app in ThemeProvider */}
              <GlobalStyle />
              <App />
            </ThemeProvider>
          </SnackbarProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

