import React from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";

const DashboardHeader = ({ user }) => {
  const locationData = {
    city: user.city,
    state: user.state,
    country: user.country,
    lat: user.lat,
    lon: user.lon,
    timeZone: user.timeZone,
  };

  return (
    <div className="CompanyDashboard-Top">
      <h1>
        Welcome, {user?.companyName || `${user.firstName} ${user.lastName}`}!
      </h1>
      <WeatherWidget locationData={locationData} />
    </div>
  );
};

export default DashboardHeader;
