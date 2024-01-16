import React ,{useEffect}from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate,  } from "react-router-dom";

const Main = () => {
  const { user, loading } = useAuth(); // Destructure loading from useAuth
  const navigate = useNavigate();

useEffect(() => {
  console.log("Main useEffect - Loading:", loading);
  if (!loading) {
    if (!user) {
      navigate("/login");
    }
  }
}, [loading, navigate, user]);



  if (loading) {
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