import React, { useState, useEffect } from "react";

const WeatherWidget = ({ city, currentWeather }) => {
  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Assuming you have a function to fetch weather data based on the user's location
    // For simplicity, let's use a placeholder function
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.GEO_API_KEY}`
        );

        if (!response.ok) {
          // Handle non-successful response (e.g., 404)
          throw new Error(
            `Failed to fetch weather data: ${response.statusText}`
          );
        }

        const data = await response.json();
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
        setError(error.message);
      }
    };

    fetchWeatherData();
  }, [city, currentWeather]); // Add currentWeather to the dependency array if needed

  return (
    <div className="WeatherWidget">
      {error ? (
        <p>Error fetching weather data: {error}</p>
      ) : (
        weather.temperature &&
        weather.description && (
          <p>
            Current Weather: {weather.temperature}°C, {weather.description}
          </p>
        )
      )}
      {/* Add additional rendering or loading state if needed */}
    </div>
  );
};

export default WeatherWidget;
