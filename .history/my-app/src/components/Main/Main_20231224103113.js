import React, { useContext } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";

const Main = () => {
  const { user } = useContext(AuthContext);
   console.log(user);
  return (
    <div className="Main">
      {user ? (
        company.isCompany ? (
          <CompanyDashboard company={company} />
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