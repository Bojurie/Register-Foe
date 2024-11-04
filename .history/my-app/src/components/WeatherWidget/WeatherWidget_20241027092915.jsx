import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import {
  WiDaySunny,
  WiRain,
  WiSnow,
  WiCloudy,
  WiThunderstorm,
  WiNightClear,
} from "react-icons/wi";
import "./WeatherWidget.css";

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({});
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const fetchWeatherData = async () => {
    try {
      const { latitude, longitude } = locationData;
      if (!API_KEY) {
        setError("API key is missing. Please provide a valid API key.");
        return;
      }
      if (!latitude || !longitude) {
        setError("Location data is incomplete.");
        return;
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            exclude: "hourly,daily",
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      const { temp, weather: weatherInfo } = response.data.current;
      const { description, icon } = weatherInfo[0];

      setWeather({
        temperature: temp,
        description,
        weatherIcon: icon,
      });

      updateCurrentDateTime(response.data.timezone);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Could not fetch weather data. Please try again later.");
    }
  };

  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  const getWeatherIcon = (weatherCode) => {
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
        return <WiRain />;
      case "11d":
      case "11n":
        return <WiThunderstorm />;
      case "13d":
      case "13n":
        return <WiSnow />;
      default:
        return <WiCloudy />;
    }
  };

  useEffect(() => {
    if (locationData) {
      fetchWeatherData();
    }
  }, [locationData]);

  return (
    <div className="WeatherWidget">
      {error ? (
        <p className="Error">{error}</p>
      ) : weather ? (
        <div className="WeatherWidget-Content">
          <div className="CurrentTime">
            <p>{currentDateTime.time}</p>
          </div>
          <div className="Location">
            <p>{`${locationData.city || "Your City"}, ${
              locationData.state || "Your State"
            }, ${locationData.country || "Your Country"}`}</p>
          </div>
          <p>{currentDateTime.date}</p>
          <div className="Temperature">
            <p>
              {`${weather.temperature}°C`} {getWeatherIcon(weather.weatherIcon)}{" "}
              {weather.description}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WeatherWidget;
