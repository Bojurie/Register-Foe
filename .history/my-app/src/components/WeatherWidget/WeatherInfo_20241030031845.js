import React from "react";

const WeatherInfo = ({ weatherData }) => {
  // Check if weatherData is defined and contains weatherIcon
  if (!weatherData || !weatherData.weatherIcon) {
    return <div>Loading...</div>; // or any other fallback UI
  }

  return (
    <div>
      <img src={weatherData.weatherIcon} alt="Weather Icon" />
      {/* Add more weather details here */}
      <h1>{weatherData.temperature}°</h1>
      <p>{weatherData.description}</p>
    </div>
  );
};

export default WeatherInfo;
