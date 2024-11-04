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

// Define a mapping of weather codes to their respective components
const weatherIcons = {
  "01d": faSun, // Clear sky (day)
  "01n": faSun, // Clear sky (night)
  "02d": faCloudSun, // Few clouds (day)
  "02n": faCloudSun, // Few clouds (night)
  "03d": faCloud, // Scattered clouds
  "03n": faCloud, // Scattered clouds
  "04d": faCloud, // Broken clouds
  "04n": faCloud, // Broken clouds
  "09d": faCloudShowersHeavy, // Shower rain (day)
  "09n": faCloudShowersHeavy, // Shower rain (night)
  "10d": faCloudRain, // Rain (day)
  "10n": faCloudRain, // Rain (night)
  "11d": faBolt, // Thunderstorm (day)
  "11n": faBolt, // Thunderstorm (night)
  "13d": faSnowflake, // Snow (day)
  "13n": faSnowflake, // Snow (night)
  "50d": faSmog, // Mist (day)
  "50n": faSmog, // Mist (night)
};

// Create a default component for unknown weather codes
const DefaultWeatherIcon = faCloud;

const WeatherIcon = ({ weatherCode }) => {
  // Get the corresponding weather component or fall back to the default
  const Icon = weatherIcons[weatherCode] || DefaultWeatherIcon;

  return <FontAwesomeIcon icon={Icon} size="2x" style={{ color: "inherit" }} />;
};

export default WeatherIcon;
