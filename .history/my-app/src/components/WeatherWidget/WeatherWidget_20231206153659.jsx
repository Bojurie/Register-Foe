import React, { useState, useEffect } from "react";

const WeatherWidget = ({ city, currentWeather }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    // Assuming you have a function to fetch weather data based on the user's location
    // For simplicity, let's use a placeholder function
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.GEO_API_KEY}`
        );
        const data = await response.json();
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
      }
    };

    fetchWeatherData();
  }, [city, currentWeather]); // Add currentWeather to the dependency array if needed

  return (
    <div className="WeatherWidget">
      {weather.temperature && weather.description && (
        <p>
          Current Weather: {weather.temperature}°C, {weather.description}
        </p>
      )}
      {/* Add additional rendering or loading state if needed */}
    </div>
  );
};

export default WeatherWidget;
