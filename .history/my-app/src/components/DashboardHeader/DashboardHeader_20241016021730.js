import React, { useMemo } from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import "./DashboardHeader.css";

const DashboardHeader = ({ user }) => {
  const locationData = useMemo(
    () => ({
      city: user?.city || "Unknown City",
      state: user?.state || "Unknown State",
      country: user?.country || "Unknown Country",
      lat: user?.lat || 0, // Provide 0 as fallback if lat is missing
      lon: user?.lon || 0, // Provide 0 as fallback if lon is missing
      timeZone: user?.timeZone || "UTC", // Default to UTC if no time zone is provided
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
