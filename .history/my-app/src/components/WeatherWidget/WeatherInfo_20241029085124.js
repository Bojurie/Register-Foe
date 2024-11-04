import React from "react";
import WeatherIcon from "./WeatherIcon";

const WeatherInfo = ({ weather }) => (
  <div className="Temperature">
    <div className="WeatherIcon">
      <WeatherIcon weatherCode={weather.weatherIcon} />
    </div>
    <div className="WeatherDescription">
      <p>
        {`${weather.temperature}°C`} <span>{weather.description}</span>
      </p>
    </div>
  </div>
);

export default WeatherInfo;
