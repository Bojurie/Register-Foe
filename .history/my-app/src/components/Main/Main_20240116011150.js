import React ,{useEffect}from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

 useEffect(() => {
   console.log("User in Main:", user);
   if (!user) {
     console.log("No user found, navigating to login");
   } else {
     console.log("User found, navigating to main page");
   }
 }, [user, navigate]);

  return user ? (
    user.isCompany ? (
      <CompanyDashboard user={user} />
    ) : (
      <Dashboard user={user} />
    )
  ) : null;
};

export default Main;