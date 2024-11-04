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
  themes,
} from "./components/StyledComponents";
import { AuthProvider } from "./components/AuthContext/AuthContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={themes.clearDay}>
              {" "}
              {/* Updated theme usage */}
              <GlobalStyle />
              <App />
            </ThemeProvider>
          </SnackbarProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
