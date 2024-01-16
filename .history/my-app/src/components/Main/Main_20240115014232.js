import React ,{useEffect}from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate,  } from "react-router-dom";

const Main = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("No user found, navigating to login");
        navigate("/login");
      } else {
        console.log("User found, navigating to main page");
        // Navigate to the main dashboard or appropriate page
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? (
    user.isCompany ? (
      <CompanyDashboard user={user} />
    ) : (
      <Dashboard user={user} />
    )
  ) : null;
};

export default Main;