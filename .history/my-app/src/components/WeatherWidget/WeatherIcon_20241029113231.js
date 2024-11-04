import React from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiCloudy,
  WiRain,
  WiDayFog,
  WiNightFog,
  WiSnow,
  WiSleet,
  WiWindy,
  WiDayHaze,
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
      return <WiCloudy />;
    case "03d":
    case "03n":
      return <WiCloudy />; // Partly Cloudy
    case "04d":
    case "04n":
      return <WiCloudy />; // Overcast
    case "09d":
    case "09n":
      return <RainAnimation />; // Showers
    case "10d":
      return <WiRain />; // Rain during day
    case "10n":
      return <WiRain />; // Rain during night
    case "11d":
    case "11n":
      return <ThunderstormAnimation />; // Thunderstorm
    case "13d":
    case "13n":
      return <SnowAnimation />; // Snow
    case "50d":
      return <WiDayFog />; // Fog during day
    case "50n":
      return <WiNightFog />; // Fog during night
    case "21d":
      return <WiDayHaze />; // Hazy day
    case "21n":
      return <WiNightFog />; // Hazy night
    case "71d":
    case "71n":
      return <SleetAnimation />; // Sleet (new animation)
    case "23d":
    case "23n":
      return <WindyAnimation />; // Windy (new animation)
    default:
      return <WiCloudy />; // Fallback to Cloudy
  }
};

export default WeatherIcon;
