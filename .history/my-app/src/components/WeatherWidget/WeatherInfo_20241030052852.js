import React from "react";

const WeatherInfo = ({ weather }) => {
  if (!weather || !weather.current) {
    return <div>Loading...</div>;
  }

  const temperature = Math.round(weather.current.temp);
  const description = weather.current.weather[0].description;
  const weatherIcon = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`;

  return (
    <div className="WeatherInfo">
      <img src={weatherIcon} alt="Weather Icon" />
      <h2>{`${temperature}°F`}</h2>
      <p>{description}</p>
    </div>
  );
};

export default WeatherInfo;
