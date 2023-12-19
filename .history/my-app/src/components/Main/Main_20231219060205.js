import React from "react";
import { Navigate } from "react-router-dom"; 
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="Main">
      <Dashboard />
    </div>
  );
};

export default Main;
