import React, { useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";


const Main = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Redirect logic if needed
  }, [user]);

  return (
    <div className="Main">
      {user ? (
        user.isCompany ? (
          <CompanyDashboard />
        ) : (
          <Dashboard />
        )
      ) : (
        <p>Loading...</p> // Redirect to login if loading takes too long
      )}
    </div>
  );
};
export default Main;