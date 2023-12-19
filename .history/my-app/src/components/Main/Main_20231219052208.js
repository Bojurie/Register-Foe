import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user, isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <div className="Main">
      <Dashboard user={user} />
    </div>
  ) : (
    <p>Please login to view this page.</p>
  );
};

export default Main;
