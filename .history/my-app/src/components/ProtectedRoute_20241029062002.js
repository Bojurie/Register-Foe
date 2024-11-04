// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "./ThemeProvider"; // Ensure the correct import path
import { useAuth } from "./AuthContext/AuthContext";

function ProtectedRoute({ children }) {
  const { user, authChecking } = useAuth();
  const { currentTheme } = useTheme() || {}; // Default to empty if undefined

  useEffect(() => {
    if (!currentTheme) return; // Prevent error if theme is undefined

    const root = document.documentElement;
    const themeStyles = {
      "--background-color": currentTheme.background || "#fff",
      "--text-color": currentTheme.color || "#000",
      "--button-background": currentTheme.button?.background || "#007bff",
      "--button-color": currentTheme.button?.color || "#fff",
      "--button-hover-background":
        currentTheme.button?.hoverBackground || "#0056b3",
      "--heading-color": currentTheme.headingColor || "#333",
    };

    Object.keys(themeStyles).forEach((key) => {
      root.style.setProperty(key, themeStyles[key]);
    });
  }, [currentTheme]);

  if (authChecking) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
