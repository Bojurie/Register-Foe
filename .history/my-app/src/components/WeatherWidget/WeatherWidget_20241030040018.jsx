import React, { useEffect, useCallback } from "react";
import { useTheme } from "./StyledComponents"; // Adjust the import path as needed
import WeatherInfo from "./WeatherInfo"; // Adjust the import path as needed
import LocationInfo from "./LocationInfo"; // Adjust the import path as needed

const WeatherWidget = ({ locationData }) => {
  const { updateTheme } = useTheme();
  const [weather, setWeather] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Mock data for currentDateTime for demonstration purposes
  const currentDateTime = {
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
  };

  const fetchWeatherData = useCallback(async () => {
    if (!locationData) {
      setError("Location data is not available.");
      setLoading(false);
      return;
    }

    const apiKey = "ee1f18e031a37db352d8b316c5b3f7c2"; // OpenWeather API Key
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
      setLoading(false);
    } catch (error) {
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

  if (loading) return <div>Loading weather data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <LocationInfo
        currentDateTime={currentDateTime}
        city={locationData.city}
        state={locationData.state}
        country={locationData.country}
      />
      <WeatherInfo weather={weather} />
    </div>
  );
};

export default WeatherWidget;
