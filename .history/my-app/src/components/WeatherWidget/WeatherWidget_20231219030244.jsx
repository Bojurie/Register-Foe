import React, { useState, useEffect } from "react";
import axios from "axios";
import User from "../../../../server/model/User";

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  // Function to update the current date based on timezone
  const updateCurrentDate = (timeZone) => {
    const now = new Date();
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: timeZone,
    });
    setCurrentDate(dateFormatter.format(now));
  };

  useEffect(() => {
    if (!locationData) return;

    // Fetch weather data
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat: locationData.lat,
              lon: locationData.lon,
              appid: process.env.GEO_API_KEY,
              units: "metric",
            },
          }
        );

        setWeather({
          temperature: response.data.main.temp,
          description: response.data.weather[0].description,
        });

        // Update date based on location's timezone
        updateCurrentDate(locationData.timeZone);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Trouble fetching weather data. Please try again later.");
      }
    };

    fetchWeatherData();
  }, [locationData]);

  const formatLocation = () => {
    const parts = [];
    if (locationData.city) parts.push(locationData.city);
    if (locationData.state) parts.push(locationData.state);
    if (locationData.country) parts.push(locationData.country);
    return parts.join(", ");
  };

  return (
    <div className="WeatherWidget">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <div>
          <p>`${user.city} {user.state} {user.country}`</p>
           <p>
              Current Weather in {formatLocation() || "your area"}:{" "}
              {weather.temperature}°C, {weather.description}
            </p>
            <p>Current Date: {currentDate}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
