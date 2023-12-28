import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useAuth } from "../AuthContext/AuthContext";


const Main = () => {
  const { user } = useAuth();

  if (!user) {
    // Handle the case when user is not authenticated
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