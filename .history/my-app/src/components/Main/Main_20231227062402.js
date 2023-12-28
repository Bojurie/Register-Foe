import React, { useContext} from "react";
import Dashboard from "../Dashboard/Dashboard";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const Main = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <div>Loading...</div>;
      console.log("User Data:", user);

  }
  return (
    <div>
      {user.isCompany ? (
        <CompanyDashboard />
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default Main;
