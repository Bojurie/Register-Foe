import React ,{useEffect}from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useAuth } from "../AuthContext/AuthContext";
import { useNavigate,  } from "react-router-dom";

const Main = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleTokenExpiry = () => {
  //     navigate("/login");
  //     localStorage.removeItem("token");
  //   };
  //   window.addEventListener("token-expired", handleTokenExpiry);
  //   return () => {
  //     window.removeEventListener("token-expired", handleTokenExpiry);
  //   };
  // }, [navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>;
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