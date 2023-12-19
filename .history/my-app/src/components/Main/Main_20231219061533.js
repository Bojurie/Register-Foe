// Main.js
import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  );
};

export default Main;
