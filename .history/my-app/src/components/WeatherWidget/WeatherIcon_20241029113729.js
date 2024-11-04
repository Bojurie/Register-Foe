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

const WeatherIcon = ({ weatherCode }) => {
  switch (weatherCode) {
    case "01d":
      return <WiDaySunny />;
    case "01n":
      return <WiNightClear />;
    case "02d":
    case "02n":
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      return <WiCloudy />;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      return <RainAnimation />;
    case "11d":
    case "11n":
      return <ThunderstormAnimation />;
    case "13d":
    case "13n":
      return <SnowAnimation />; // Use animation for heavy snow
    case "sleet":
      return <WiSleet />; // Icon for sleet
    case "50d":
    case "50n":
      return <SleetAnimation />; // Animation for sleet-like conditions
    case "snow":
      return <WiSnow />; // Icon for light snow
    case "windy":
      return <WiWindy />; // Icon for windy conditions
    case "WindyAnimation":
      return <WindyAnimation />; // Animation for stronger wind conditions
    default:
      return <WiCloudy />;
  }
};

export default WeatherIcon;
