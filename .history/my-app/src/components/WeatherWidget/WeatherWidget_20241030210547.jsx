import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import LocationInfo from "./LocationInfo";
import { useTheme } from "../StyledComponents"; // Adjust the import path as necessary

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { updateTheme } = useTheme(); // Destructure updateTheme from the theme context

  const fetchWeatherData = useCallback(async () => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

    if (!locationData || !apiKey) {
      setError("Weather data is unavailable.");
      setLoading(false);
      return;
    }

    const { latitude, longitude } = locationData;

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/3.0/onecall",
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: apiKey,
            units: "metric",
          },
        }
      );
      setWeather(response.data);

      // Determine the current hour and weather icon to update the theme
      const currentHour = new Date().getHours();
      const weatherIcon = response.data.current.weather[0].description; // Get the weather description
      updateTheme(weatherIcon, currentHour); // Update the theme based on weather and time
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
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
      {weather && (
        <LocationInfo locationData={locationData} weather={weather} />
      )}
    </div>
  );
};

export default WeatherWidget;
