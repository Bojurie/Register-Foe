import React, { useContext, useEffect} from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";

import { AuthContext } from "../AuthContext/AuthContext.jsx";

const Main = () => {
  const { user } = useContext(AuthContext);

  // Check if user is null or undefined before accessing isCompany
  if (!user) {
    return <div>Loading...</div>; // or any other loading state
  }

  // Perform conditional rendering based on user.isCompany
  return (
    <div>
      {user.isCompany ? (
        // Render Company Dashboard
        <CompanyDashboard />
      ) : (
        // Render User Dashboard
        <Dashboard />
      )}
    </div>
  );
};

export default Main;
