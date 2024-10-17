import React, { useEffect, useState } from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import "./DashboardHeader.css";
import axios from "axios";

const API_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?`;
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

const DashboardHeader = ({ user }) => {
  const [locationData, setLocationData] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);

  // Get user's current geolocation
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocationData({ latitude, longitude });
          },
          (error) => {
            console.error("Error fetching location:", error);
            setError("Could not fetch your location.");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };
    getLocation();
  }, []);

  return (
    <div className="CompanyDashboard-Top">
      <h1>
        Welcome,{" "}
        {user?.companyName ||
          `${user?.firstName || "User"} ${user?.lastName || ""}`}
        !
      </h1>
      {error && <p className="Error">{error}</p>}
      {locationData.latitude && locationData.longitude ? (
        <WeatherWidget locationData={locationData} />
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  );
};

export default DashboardHeader;
