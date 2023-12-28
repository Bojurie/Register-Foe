import React, { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";

const Main = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (user.isCompany) {
    // Render the company dashboard
    return <CompanyDashboard />;
  } else {
    // Render the user dashboard
    return <Dashboard />;
  }
};

export default Main;
