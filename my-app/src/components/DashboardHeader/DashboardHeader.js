import React from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";

const DashboardHeader = ({ user }) => {
  return (
    <div className="CompanyDashboard-Top">
      <h1>Welcome, {user?.companyName || "Guest"}!</h1>
      <WeatherWidget user={user} />
    </div>
  );
};

export default DashboardHeader;
