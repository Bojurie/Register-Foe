// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/";

const PrivateRoute = ({ path, element }) => {
  const { user } = useAuth();

  return (
    <Route path={path} element={user ? element : <Navigate to="/login" />} />
  );
};


export default PrivateRoute;
