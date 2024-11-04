import React from "react";

const WeatherInfo = ({ weather }) => {
  return (
    <div className="WeatherInfo">
      <img
        src={`https://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
        alt={weather.description}
      />
      <h2>{`${Math.round(weather.temperature)}°F`}</h2>{" "}
      {/* Display temperature in Fahrenheit */}
      <p>{weather.description}</p>
    </div>
  );
};

export default WeatherInfo;
