import React from "react";

const WeatherInfo = ({ weather }) => {
  if (!weather || !weather.current) {
    return <div>Loading...</div>; // or any other fallback UI
  }

  const temperature = Math.round(weather.current.temp); // Fetching temperature
  const description = weather.current.weather[0].description; // Fetching description
  const weatherIcon = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`; // Fetching weather icon URL

  return (
    <div className="WeatherInfo">
      <img src={weatherIcon} alt="Weather Icon" />
      <h2>{`${temperature}°F`}</h2> {/* Display temperature in Fahrenheit */}
      <p>{description}</p> {/* Display weather description */}
    </div>
  );
};

export default WeatherInfo;
