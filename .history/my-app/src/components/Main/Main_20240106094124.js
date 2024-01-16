import React ,{useEffect}from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate,  } from "react-router-dom";

const Main = () => {
  const { user, loading } = useAuth(); // Destructure loading from useAuth
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]); // Add loading to useEffect dependencies

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