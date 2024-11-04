// src/components/WeatherWidget/WeatherIcon.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloudSun,
  faCloud,
  faSnowflake,
  faCloudRain,
  faBolt,
  faWind,
  faSmog,
  faCloudShowersHeavy,
} from "@fortawesome/free-solid-svg-icons";

const weatherIcons = {
  "01d": faSun,
  "01n": faSun,
  "02d": faCloudSun,
  "02n": faCloudSun,
  "03d": faCloud,
  "03n": faCloud,
  "04d": faCloud,
  "04n": faCloud,
  "09d": faCloudShowersHeavy,
  "09n": faCloudShowersHeavy,
  "10d": faCloudRain,
  "10n": faCloudRain,
  "11d": faBolt,
  "11n": faBolt,
  "13d": faSnowflake,
  "13n": faSnowflake,
  "50d": faSmog,
  "50n": faSmog,
};

const DefaultWeatherIcon = faCloud;

const WeatherIcon = ({ weatherCode }) => {
  const Icon = weatherIcons[weatherCode] || DefaultWeatherIcon;
  return <FontAwesomeIcon icon={Icon} size="2x" style={{ color: "inherit" }} />;
};

export default WeatherIcon;
