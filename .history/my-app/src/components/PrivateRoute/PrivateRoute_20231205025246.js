// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const PrivateRoute = ({ Component, ...rest  }) => {
  const { user } = useAuth();

  return (
    <Route 
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
};

export default PrivateRoute;
