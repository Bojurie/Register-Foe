import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useAuth } from "../AuthContext/AuthContext";


const Main = () => {
  const { user, isAuthenticated } = useAuth();

  // Check if the authentication status is being determined
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading while checking auth status
  }

  if (!user) {
    // If not authenticated, you can redirect or show a login page
    return <Redirect to="/login" />;
  }

  // Render the appropriate dashboard based on user type
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
