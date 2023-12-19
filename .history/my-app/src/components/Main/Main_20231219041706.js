import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <div className="Main">
      <Dashboard />
    </div>
  ) : (
    <p>Please login to view this page.</p>
  );
};

export default Main;
