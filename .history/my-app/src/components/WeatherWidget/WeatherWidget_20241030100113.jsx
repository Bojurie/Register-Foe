// WeatherWidget.js
import React, { useEffect, useCallback, useState } from "react";
import { useTheme } from "../StyledComponents";
import LocationInfo from "./LocationInfo";
import "./WeatherWidget.css";

const WeatherWidget = ({ locationData }) => {
  const { updateTheme } = useTheme();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    if (!locationData) {
      setError("Location data is not available.");
      setLoading(false);
      return;
    }

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const { latitude, longitude } = locationData;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) throw new Error("Network response was not ok.");

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [locationData]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    if (weather) {
      const hour = new Date().getHours();
      const weatherIcon = weather.current.weather[0].icon;
      updateTheme(weatherIcon, hour);
    }
  }, [weather, updateTheme]);

  return (
    <div className="WeatherWidget">
      {loading && <div className="Loading">Loading...</div>}
      {error && <div className="Error">Error: {error}</div>}
      {weather && (
        <LocationInfo locationData={locationData} weather={weather} />
      )}
    </div>
  );
};

export default WeatherWidget;