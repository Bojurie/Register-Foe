import React, { useEffect, useCallback } from "react";
import { useTheme } from "../StyledComponents"; // Adjust the import path as needed

const WeatherWidget = ({ locationData }) => {
  const { updateTheme } = useTheme();
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchWeatherData = useCallback(async () => {
    console.log("Fetching weather data..."); // Log when fetching starts
    if (!locationData) {
      console.log("No location data available.");
      setError("Location data is not available.");
      setLoading(false);
      return;
    }

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // OpenWeather API Key
    const { latitude, longitude } = locationData;

    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Log location data

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }

      const data = await response.json();
      console.log("Weather Data: ", data); // Log the fetched weather data
      setWeather(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [locationData]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    if (weather) {
      const hour = new Date().getHours();
      const weatherIcon = weather.current.weather[0].icon; // Make sure this path is correct
      updateTheme(weatherIcon, hour);
    }
  }, [weather, updateTheme]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>
        Current Weather in {locationData.city}, {locationData.state},{" "}
        {locationData.country}
      </h2>
      <p>{weather.current.weather[0].description}</p>
      <p>Temperature: {weather.current.temp}°F</p>
      {/* Add more weather details as needed */}
    </div>
  );
};

export default WeatherWidget;
