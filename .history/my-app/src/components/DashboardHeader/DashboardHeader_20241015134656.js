import React, { useMemo } from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import "./DashboardHeader.css"; 

const DashboardHeader = ({ user }) => {
  const locationData = useMemo(
    () => ({
      city: user?.city || "Unknown City",
      state: user?.state || "Unknown State",
      country: user?.country || "Unknown Country",
      lat: user?.lat || 0,
      lon: user?.lon || 0,
      timeZone: user?.timeZone || "UTC",
    }),
    [user]
  );

  return (
    <div className="CompanyDashboard-Top">
      <h1>
        Welcome,{" "}
        {user?.companyName ||
          `${user?.firstName || "User"} ${user?.lastName || ""}`}
        !
      </h1>
      <WeatherWidget locationData={locationData} />
    </div>
  );
};

export default DashboardHeader;
