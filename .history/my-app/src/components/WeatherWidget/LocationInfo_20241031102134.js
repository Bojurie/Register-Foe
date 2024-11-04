// LocationInfo.js
import React from "react";

const LocationInfo = ({ weather }) => {
  if (!weather) return <p>Weather data not available.</p>;

  // Safely access properties using optional chaining (?.)
  const time = new Date(weather.current?.dt * 1000).toLocaleTimeString();
  const temperature = weather.current?.temp;
  const description = weather.current?.weather[0]?.description;

  return (
    <div className="location-info">
      <h2>Weather Information</h2>
      <p>Time: {time}</p>
      <p>Temperature: {temperature}°C</p>
      <p>Condition: {description}</p>
    </div>
  );
};

export default LocationInfo;
