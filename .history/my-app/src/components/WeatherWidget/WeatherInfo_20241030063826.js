import React from "react";
import { motion } from "framer-motion";
import "./WeatherInfo.css";

const WeatherInfo = ({ weather }) => {
  if (!weather || !weather.current) {
    return <div>Loading...</div>;
  }

  const temperature = Math.round(weather.current.temp);
  const description = weather.current.weather[0].description;
  const weatherIcon = `http://openweathermap.org/img/wn/${weather.current.weather[0].icon}.png`;

  return (
    <div className="WeatherInfo">
      <motion.img
        src={weatherIcon}
        alt="Weather Icon"
        className="WeatherIcon"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.h2
        className="Temperature"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {`${temperature}°F`}
      </motion.h2>
      <motion.p
        className="Description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {description}
      </motion.p>
    </div>
  );
};

export default WeatherInfo;
