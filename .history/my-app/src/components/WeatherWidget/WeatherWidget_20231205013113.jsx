// WeatherWidget.jsx
import React, { useState, useEffect } from "react";

const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    // Assume you have a function to fetch weather data based on the user's location
    // For simplicity, let's use a placeholder function
    const fetchWeatherData = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`
      );
      const data = await response.json();
      setWeather({
        temperature: data.main.temp,
        description: data.weather[0].description,
      });
    };

    fetchWeatherData();
  }, [city]);

  return (
    <div className="WeatherWidget">
      <p>
        Current Weather: {weather.temperature}°C, {weather.description}
      </p>
    </div>
  );
};

export default WeatherWidget;
