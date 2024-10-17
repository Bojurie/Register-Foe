import React, { useEffect, useState } from "react";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import "./DashboardHeader.css";
import axios from "axios";

// OpenWeather API and Key
const API_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall?`;
const API_KEY = `9be43cc1843e21a4e078fd1ed9c9b2fd`;

const DashboardHeader = ({ user }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // Get user's current geolocation
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Corrected the 'coords' typo
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
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

  // Fetch weather data when latitude and longitude are available
  useEffect(() => {
    if (latitude && longitude) {
      const fetchWeatherData = async () => {
        try {
          const response = await axios.get(API_ENDPOINT, {
            params: {
              lat: latitude,
              lon: longitude,
              exclude: "hourly,daily",
              appid: API_KEY,
              units: "metric", // Get temperature in Celsius
            },
          });

          // Logging response to see the data
          console.log("Weather API Response:", response.data);
          setWeatherData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setError("Could not fetch weather data.");
        }
      };

      fetchWeatherData();
    }
  }, [latitude, longitude]);

  return (
    <div className="CompanyDashboard-Top">
      <h1>
        Welcome,{" "}
        {user?.companyName ||
          `${user?.firstName || "User"} ${user?.lastName || ""}`}
        !
      </h1>
      {error && <p className="Error">{error}</p>}
      <WeatherWidget weatherData={weatherData} />
    </div>
  );
};

export default DashboardHeader;
