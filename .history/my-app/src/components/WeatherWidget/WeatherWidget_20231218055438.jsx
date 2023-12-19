// WeatherWidget.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              q: city,
              appid: process.env.GEO_API_KEY,
              units: "metric",
            },
          }
        );
        setWeather({
          temperature: response.data.main.temp,
          description: response.data.weather[0].description,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Trouble fetching weather data. Please try again later.");
      }
    };

    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  return (
    <div className="WeatherWidget">
      {error ? (
        <p>{error}</p>
      ) : (
        weather.temperature &&
        weather.description && (
          <p>
            Current Weather: {weather.temperature}°C, {weather.description}
          </p>
        )
      )}
    </div>
  );
};

export default WeatherWidget;
