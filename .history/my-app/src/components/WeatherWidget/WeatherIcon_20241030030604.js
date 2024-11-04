// src/components/WeatherWidget/WeatherIcon.js
import React from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiSnow,
  WiSleet,
  WiWindy,
  WiRain,
  WiFog,
  WiThunderstorm,
  WiHurricane,
} from "react-icons/wi";
import RainAnimation from "./RainAnimation";
import ThunderstormAnimation from "./ThunderstormAnimation";
import SnowAnimation from "./SnowAnimation";
import SleetAnimation from "./SleetAnimation";
import WindyAnimation from "./WindyAnimation";

// Define a mapping of weather codes to their respective components
const weatherComponents = {
  "01d": WiDaySunny, // Clear sky (day)
  "01n": WiNightClear, // Clear sky (night)
  "02d": WiCloudy, // Few clouds (day)
  "02n": WiCloudy, // Few clouds (night)
  "03d": WiCloudy, // Scattered clouds
  "03n": WiCloudy, // Scattered clouds
  "04d": WiCloudy, // Broken clouds
  "04n": WiCloudy, // Broken clouds
  "09d": RainAnimation, // Shower rain (day)
  "09n": RainAnimation, // Shower rain (night)
  "10d": WiRain, // Rain (day)
  "10n": WiRain, // Rain (night)
  "11d": ThunderstormAnimation, // Thunderstorm (day)
  "11n": ThunderstormAnimation, // Thunderstorm (night)
  "13d": SnowAnimation, // Snow (day)
  "13n": SnowAnimation, // Snow (night)
  "50d": SleetAnimation, // Mist (day)
  "50n": SleetAnimation, // Mist (night)
  fog: WiFog, // Fog
  hurricane: WiHurricane, // Hurricane
  windy: WiWindy, // Windy
};

// Create a default component for unknown weather codes
const DefaultWeatherIcon = WiCloudy;

const WeatherIcon = ({ weatherCode }) => {
  // Get the corresponding weather component or fall back to the default
  const IconComponent = weatherComponents[weatherCode] || DefaultWeatherIcon;

  return <IconComponent />;
};

export default WeatherIcon;
