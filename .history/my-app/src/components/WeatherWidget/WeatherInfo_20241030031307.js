import React from "react";
import WeatherIcon from "./WeatherIcon";

const WeatherInfo = ({ weather }) => {
  if (
    !weather ||
    !weather.current ||
    !weather.current.weather ||
    weather.current.weather.length === 0
  ) {
    return <div>No weather data available.</div>;
  }

  const weatherData = weather.current.weather[0];
  const temperature = Math.round(weather.current.temp);
  const weatherIcon = weatherData.icon;
  const description = weatherData.description;

  return (
    <div className="WeatherInfo">
      <WeatherIcon weatherCode={weatherIcon} />
      <h2>{`${temperature}°F`}</h2>
      <p>{description}</p>
    </div>
  );
};

export default WeatherInfo;
