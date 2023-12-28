import React, { useContext, useEffect} from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";
import { useNavigate } from "react-router";

const Main = () => {
  const Navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      Navigate("/login");
    }
  }, [user, Navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

const DashboardComponent = user.isCompany ? CompanyDashboard : Dashboard;
  console.log("DashboardComponent selected:", DashboardComponent.name);
  return (
    <div className="Main">
      <DashboardComponent user={user} />
    </div>
  );
};

export default Main;