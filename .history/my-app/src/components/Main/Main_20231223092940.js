import React, { useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";

const Main = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="Main">
      {user ? (
        user.isCompany ? (
          <CompanyDashboard user={user} />
        ) : (
          <Dashboard user={user} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default Main;