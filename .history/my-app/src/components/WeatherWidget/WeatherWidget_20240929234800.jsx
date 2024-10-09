import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from "luxon";
import {
  WiDaySunny,
  WiRain,
  WiSnow,
  WiCloudy,
  WiThunderstorm,
} from "react-icons/wi";

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

  const getWeatherIcon = (weatherCode) => {
    switch (weatherCode) {
      case "01d":
      case "01n":
        return <WiDaySunny />;
      case "02d":
      case "02n":
        return <WiCloudy />;
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
