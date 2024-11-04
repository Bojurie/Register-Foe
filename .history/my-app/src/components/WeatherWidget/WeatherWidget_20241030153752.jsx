import React, { useEffect, useCallback, useState } from "react";
import LocationInfo from "./LocationInfo";
import "./WeatherWidget.css";

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    if (!locationData || !apiKey) {
      setError("Weather data is unavailable.");
      setLoading(false);
      return;
    }

    const { latitude, longitude } = locationData;
    console.log(locationData)
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) throw new Error("Failed to fetch weather data.");
     const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [locationData]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  return (
    <div className="WeatherWidget">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weather && (
        <LocationInfo locationData={locationData} weather={weather} />
      )}
    </div>
  );
};

export default WeatherWidget;
