import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";

const WeatherWidget = ({ locationData, user }) => {
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

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
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Trouble fetching weather data. Please try again later.");
      }
    };

    const updateCurrentDate = (timeZone) => {
      const now = DateTime.now().setZone(timeZone);
      setCurrentDate(
        now.toLocaleString({
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      );
      setCurrentTime(now.toLocaleString(DateTime.TIME_SIMPLE));
    };

    fetchWeatherData();
  }, [locationData]);

  const formatLocation = () => {
    const parts = [];
    if (user && user.city) parts.push(user.city);
    if (user && user.state) parts.push(user.state);
    if (user && user.country) parts.push(user.country);
    return parts.join(", ");
  };

  return (
    <div className="WeatherWidget">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="WeatherWidget-Content">
            <div className="CurrentTime">
              <p>{currentTime}</p>
            </div>
            <div className="Location">
              <p>
                {user
                  ? `${user.city}, ${user.state}, ${user.country}`
                  : "Location: Not available"}
              </p>
            </div>
            <p>{currentDate}</p>
            <div className="Temperature">
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
