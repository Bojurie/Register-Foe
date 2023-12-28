import React, { useContext } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";

const Main = () => {
  const { user } = useContext(AuthContext);

  console.log("User in Main component:", user); 

  if (!user) {
    return <p>Loading...</p>;
  }

  const DashboardComponent = user.isCompany ? CompanyDashboard : Dashboard;

  return (
    <div className="Main">
      <DashboardComponent user={user} />
    </div>
  );
};
export default Main;