import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../Context/UserContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Render a loading spinner or component while checking authentication status
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
