// src/components/WeatherWidget/WeatherIcon.js
import React from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiSnow,
  WiSleet,
  WiWindy,
} from "react-icons/wi";
import RainAnimation from "./RainAnimation";
import ThunderstormAnimation from "./ThunderstormAnimation";
import SnowAnimation from "./SnowAnimation";
import SleetAnimation from "./SleetAnimation";
import WindyAnimation from "./WindyAnimation";

// Define a mapping of weather codes to their respective components
const weatherComponents = {
  "01d": WiDaySunny,
  "01n": WiNightClear,
  "02d": WiCloudy,
  "02n": WiCloudy,
  "03d": WiCloudy,
  "03n": WiCloudy,
  "04d": WiCloudy,
  "04n": WiCloudy,
  "09d": RainAnimation,
  "09n": RainAnimation,
  "10d": RainAnimation,
  "10n": RainAnimation,
  "11d": ThunderstormAnimation,
  "11n": ThunderstormAnimation,
  "13d": SnowAnimation,
  "13n": SnowAnimation,
  "50d": SleetAnimation,
  "50n": SleetAnimation,
};

// Create a default component for unknown weather codes
const DefaultWeatherIcon = WiCloudy;

const WeatherIcon = ({ weatherCode }) => {
  // Get the corresponding weather component or fall back to the default
  const IconComponent = weatherComponents[weatherCode] || DefaultWeatherIcon;

  return <IconComponent />;
};

export default WeatherIcon;
