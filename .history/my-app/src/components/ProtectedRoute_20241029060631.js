import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "./ThemeProvider"; // Ensure the correct import path
import { useAuth } from "./AuthContext/AuthContext";

function ProtectedRoute({ children }) {
  const { user, authChecking } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) return; // Prevent error if theme is undefined

    const root = document.documentElement;
    const themeStyles = {
      "--background-color": theme.background || "#fff",
      "--text-color": theme.color || "#000",
      "--button-background": theme.button?.background || "#007bff",
      "--button-color": theme.button?.color || "#fff",
      "--button-hover-background": theme.button?.hoverBackground || "#0056b3",
      "--heading-color": theme.headingColor || "#333",
    };

    Object.keys(themeStyles).forEach((key) => {
      root.style.setProperty(key, themeStyles[key]);
    });
  }, [theme]);

  if (authChecking) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;