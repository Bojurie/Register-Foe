import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faSnowflake,
  faRain,
} from "@fortawesome/free-solid-svg-icons";

const WeatherWidget = ({ locationData, user }) => {
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationData) return;

    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat: locationData.lat,
              lon: locationData.lon,
              appid: process.env.OPENWEATHER,
              units: "metric",
            },
          }
        );
        setWeather({
          temperature: response.data.main.temp,
          description: response.data.weather[0].description,
        });

        updateCurrentDate(locationData.timeZone);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Trouble fetching weather data. Please try again later.");
        setLoading(false);
      }
    };

    const updateCurrentDate = (timeZone) => {
      const now = DateTime.now().setZone(timeZone);
      setCurrentDate(now.toFormat("MMM dd, yyyy"));
      setCurrentTime(
        now.toLocaleString({
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })
      );
    };

    fetchWeatherData();
  }, [locationData]);

  const formatLocation = () => {
    if (user) {
      const parts = [];
      if (user.city) parts.push(user.city);
      if (user.state) parts.push(user.state);
      if (user.country) parts.push(user.country);
      return parts.join(", ");
    }
    return "Location: Not available";
  };

  // Define a function to map weather descriptions to FontAwesome icons
  const mapWeatherToIcon = (description) => {
    const lowerDescription = description.toLowerCase();
    if (lowerDescription.includes("clear")) {
      return <FontAwesomeIcon icon={faSun} />;
    } else if (lowerDescription.includes("cloud")) {
      return <FontAwesomeIcon icon={faCloud} />;
    } else if (lowerDescription.includes("snow")) {
      return <FontAwesomeIcon icon={faSnowflake} />;
    } else if (lowerDescription.includes("rain")) {
      return <FontAwesomeIcon icon={faRain} />;
    }
    return null; // Return null for unknown conditions
  };

  return (
    <div className="WeatherWidget">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="WeatherWidget-Content">
            <div className="CurrentTime">
              <p>{currentTime}</p>
            </div>
            <div className="Location">
              <p>{formatLocation()}</p>
            </div>
            <p>{currentDate}</p>
            <div className="Temperature">
              {mapWeatherToIcon(weather.description)}{" "}
              {/* Display weather icon */}
              <p>
                {formatLocation() || "your area"}: {weather.temperature}°C,{" "}
                {weather.description}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
