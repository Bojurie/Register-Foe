import React, { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";

const Main = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    // If not authenticated, you can render a loading message or redirect to a login page.
    return <div>Loading...</div>;
  }

  // Check if the user is a company
  if (user.isCompany) {
    // Render the company dashboard
    return <CompanyDashboard />;
  } else {
    // Render the user dashboard
    return <Dashboard />;
  }
};

export default Main;
