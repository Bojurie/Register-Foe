import React, { useContext, useEffect} from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom




const Main = () => {
  const navigate = useNavigate(); // Use navigate instead of Navigate

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      // Handle case when user is not logged in
      navigate("/login"); // Use navigate to redirect to the login page
    }
  }, [user, navigate]); // Add user and navigate to the dependency array

  console.log("User in Main component:", user);

  if (!user) {
    return null; // Return null to prevent further rendering
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