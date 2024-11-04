import React from "react";

const WeatherInfo = ({ weather }) => {
  return (
    <div className="WeatherInfo">
     
      <h2>{`${Math.round(weather.temperature)}°F`}</h2>{" "}
      {/* Display temperature in Fahrenheit */}
      <p>{weather.description}</p>
    </div>
  );
};

export default WeatherInfo;
