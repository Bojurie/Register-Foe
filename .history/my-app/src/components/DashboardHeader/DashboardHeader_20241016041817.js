import React, { useEffect, useMemo, useState } from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import "./DashboardHeader.css";
import axios from "axios";


const API_endpoint = `https://api.openweathermap.org/data/3.0/onecall?`;
API_KEY_LOC = `ee1f18e031a37db352d8b316c5b3f7c2`;

const DashboardHeader = ({ user }) => {
  const [latitude, setLatitude ] = useState("");
  const [longitude, setLongitude ] = useState("")

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((position) =>{
      setLatitude(position.cords.latitude);
      setLongitude(position.cords.longitude);
    })
    axios.get(
      `${API_endpoint}
      lat=${latitude}
      &lon=${longitude}
      &exclude=hourly,daily
      &appid={API_KEY_LOC}`
      .then((response) =>{
        console.log(response.data)
      })
    );
  }, [])

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
