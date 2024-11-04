import React from "react";
import { WiDaySunny, WiNightClear, WiCloudy } from "react-icons/wi";
import RainAnimation from "./RainAnimation";
import ThunderstormAnimation from "./ThunderstormAnimation";
import SnowAnimation from "./SnowAnimation";

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
      return <SnowAnimation />;
    default:
      return <WiCloudy />;
  }
};

export default WeatherIcon;
