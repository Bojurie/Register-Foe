import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import LocationInfo from "./LocationInfo";
import { useTheme } from "../StyledComponents";

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { updateTheme } = useTheme();
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const fetchWeatherData = useCallback(async () => {
    if (!locationData || !apiKey) {
      setError(
        "Weather data is unavailable. Please check your location and API key."
      );
      setLoading(false);
      return;
    }

    const { latitude, longitude } = locationData;

    try {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);

      if (response.data) {
        setWeather(response.data);
        const currentHour = new Date().getHours();
        const weatherIcon = response.data.current.weather[0].description;
        updateTheme(weatherIcon, currentHour);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch weather data.";
      setError(`Error: ${message}`);
      console.error("Error fetching weather data:", err);
    } finally {
      setLoading(false);
    }
  }, [locationData, updateTheme, apiKey]);

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
