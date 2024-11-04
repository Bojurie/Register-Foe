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

      const currentHour = new Date().getHours();
      const weatherIcon = response.data.current.weather[0].description; 
      updateTheme(weatherIcon, currentHour); 
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
