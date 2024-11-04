import React from "react";
import WeatherIcon from "./WeatherIcon";

const WeatherInfo = ({ weather }) => {
  // Handle potential missing weather data gracefully
  if (
    !weather ||
    !weather.current ||
    !weather.current.weather ||
    weather.current.weather.length === 0
  ) {
    return <div>No weather data available.</div>;
  }

  // Extract relevant weather information
  const weatherData = weather.current.weather[0]; // Get the first weather object
  const temperature = Math.round(weather.current.temp); // Get the temperature, rounded
  const weatherIcon = weatherData.icon; // Get the weather icon
  const description = weatherData.description; // Get the weather description

  return (
    <div className="WeatherInfo">
      <WeatherIcon weatherCode={weatherIcon} />
      <h2>{`${temperature}°F`}</h2> {/* Display temperature in Fahrenheit */}
      <p>{description}</p>
    </div>
  );
};

export default WeatherInfo;
