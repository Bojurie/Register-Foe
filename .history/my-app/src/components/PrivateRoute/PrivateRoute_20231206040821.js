// PrivateRoute.js
import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "./AuthContext/AuthContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route {...rest} element={user ? element : <Navigate to="/signin" />} />
  );
};

export default PrivateRoute;
