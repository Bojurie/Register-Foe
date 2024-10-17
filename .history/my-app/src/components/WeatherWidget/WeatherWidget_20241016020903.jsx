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
import "./WeatherWidget.css"; // Importing styles for the widget

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState({});
  const API_KEY = process.env.OPENWEATHER_API_KEY || "YOUR_API_KEY_HERE"; // Add fallback API key

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      const { lat, lon } = locationData;

      // Logging the API key and location data to debug potential issues
      console.log("Using API Key:", API_KEY);
      console.log("Location Data:", locationData);

      if (!API_KEY || !lat || !lon) {
        throw new Error("Missing API key or location data");
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall`,
        {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      // Logging the full response object to inspect it
      console.log("Weather API Response:", response);

      const { temp, weather: weatherInfo } = response.data.current;
      const { description, icon } = weatherInfo[0];

      // Setting weather state after successful response
      setWeather({
        temperature: temp,
        description,
        weatherIcon: icon,
      });

      updateCurrentDateTime(locationData.timeZone);
    } catch (error) {
      // Detailed error logging
      console.error("Error occurred during weather data fetch:", error);
      setError("Could not fetch weather data. Please try again later.");
    }
  };

  // Function to update current date and time based on timezone
  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString({
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: now.toLocaleString({
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }),
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
    if (!locationData || !API_KEY) {
      setError("Location data or API key is missing.");
    } else {
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
            <p>{`${locationData.city}, ${locationData.state}, ${locationData.country}`}</p>
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
