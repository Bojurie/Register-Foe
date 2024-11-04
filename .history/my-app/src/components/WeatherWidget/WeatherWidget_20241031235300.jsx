import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import LocationInfo from "./LocationInfo";
import { useTheme } from "../StyledComponents";

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { updateTheme } = useTheme();

  const fetchWeatherData = useCallback(async () => {
    const apiKey = "ee1f18e031a37db352d8b316c5b3f7c2";
console.log("API Key:", apiKey); // Check if API Key is present
console.log("Location Data:", locationData);
    if (!locationData || !apiKey) {
      setError("Weather data is unavailable.");
      setLoading(false);
      return;
    }

    const { latitude, longitude } = locationData;
    console.log("Location Data:", locationData); // Log the location data

    try {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      console.log("Weather API URL:", url); // Log the full API URL
      const response = await axios.get(url);

      console.log("Weather API Response:", response.data); // Log the API response data
      setWeather(response.data);

      const currentHour = new Date().getHours();
      const weatherIcon = response.data.current.weather[0].description;
      updateTheme(weatherIcon, currentHour);
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      console.error("Error fetching weather data:", err); // Log any errors
    } finally {
      setLoading(false);
    }
  }, [locationData, updateTheme]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return (
    <div className="weather-widget">
      {loading && <p>Loading weather data...</p>}
      {error && <p className="error">{error}</p>}
      {weather && locationData && (
        <LocationInfo locationData={locationData} weather={weather} />
      )}
    </div>
  );
};

export default WeatherWidget;
