import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "..component/Context/UserContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
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
