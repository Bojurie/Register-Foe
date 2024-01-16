import React ,{useEffect}from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate,  } from "react-router-dom";

const Main = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Main useEffect - User:", user, "Loading:", loading);
    if (!loading && !user) {
      console.log("Navigating to login");
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    console.log("Displaying loading...");
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Or a different placeholder for unauthenticated state
  }

  return (
    <div>
      {user.isCompany ? (
        <CompanyDashboard user={user} />
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  );
};

export default Main;