import React, { useEffect, useCallback } from "react";
import { useTheme } from "../StyledComponents";
import LocationInfo from "./LocationInfo";
import WeatherInfo from "./WeatherInfo"; // Assuming you may still want this for future use
import "./WeatherWidget.css";

const WeatherWidget = ({ locationData }) => {
  const { updateTheme } = useTheme();
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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

      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }

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

  if (loading) return <div className="Loading">Loading...</div>;
  if (error) return <div className="Error">Error: {error}</div>;

  return (
    <div className="WeatherWidget">
      <LocationInfo locationData={locationData} weather={weather} />
    </div>
  );
};

export default WeatherWidget;
