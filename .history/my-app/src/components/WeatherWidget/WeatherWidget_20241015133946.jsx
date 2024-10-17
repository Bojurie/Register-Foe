import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudy,
  WiNightCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import "./WeatherWidget.css";

// Define constants for the OpenWeather API
const API_ENDPOINT = `https://api.openweathermap.org/data/2.5/onecall`;
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

const WeatherWidget = ({ locationData }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState({});

  useEffect(() => {
    if (!locationData || !API_KEY) {
      setError("Location data or API key is missing.");
      return;
    }

    const fetchWeatherData = async () => {
      try {
        const { lat, lon } = locationData;
        const response = await axios.get(API_ENDPOINT, {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: "metric",
          },
        });

        const { temp } = response.data.current;
        const description = response.data.current.weather[0].description;
        const weatherIcon = response.data.current.weather[0].icon;

        setWeather({
          temperature: temp,
          description,
          weatherIcon,
        });

        updateCurrentDateTime(locationData.timeZone);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Could not fetch weather data. Please try again later.");
      }
    };

    const updateCurrentDateTime = (timeZone) => {
      const now = DateTime.now().setZone(timeZone);
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

    fetchWeatherData();
  }, [locationData]);

  // Function to determine which icon to display based on weather code
  const getWeatherIcon = (weatherCode) => {
    const isDay = weatherCode.endsWith("d");
    switch (weatherCode) {
      case "01d":
        return <WiDaySunny />;
      case "01n":
        return <WiNightClear />;
      case "02d":
      case "03d":
        return <WiDayCloudy />;
      case "02n":
      case "03n":
        return <WiNightCloudy />;
      case "04d":
      case "04n":
        return isDay ? <WiDayCloudy /> : <WiNightCloudy />;
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
      case "50d":
      case "50n":
        return <WiFog />;
      default:
        return null;
    }
  };

  return (
    <div className="WeatherWidget">
      {error ? (
        <p>{error}</p>
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
              <span className="WeatherDescription">
                {weather.description.charAt(0).toUpperCase() +
                  weather.description.slice(1)}
              </span>
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
