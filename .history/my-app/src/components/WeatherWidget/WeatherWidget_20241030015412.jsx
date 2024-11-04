import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { useTheme } from "../StyledComponents";
import WeatherInfo from "./WeatherInfo";
import LocationInfo from "./LocationInfo";
import {
  WidgetContainer,
  ErrorText,
  LoadingMessage,
  Spinner,
} from "./StyledWeatherWidget";

const WeatherWidget = ({ locationData }) => {
  const { currentTheme, updateTheme } = useTheme();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({});

  const { latitude, longitude } = locationData;

  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  const fetchWeatherData = async () => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Use your OpenWeather API key here
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Weather data not found.");
      }
      const weatherData = await response.json();

      const {
        current: { temp, weather, timezone },
      } = weatherData;

      const { description, icon } = weather[0];

      setWeather({
        temperature: temp,
        description,
        weatherIcon: icon,
      });
      updateCurrentDateTime(timezone);
      const hour = new Date().getHours();
      updateTheme(icon, hour);
    } catch (error) {
      setError(error.message);
      setWeather(null);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData();
    }
  }, [latitude, longitude]);

  return (
    <WidgetContainer theme={currentTheme}>
      {error ? (
        <ErrorText>{error}</ErrorText>
      ) : weather ? (
        <motion.div
          className="WeatherWidget-Content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LocationInfo
            currentDateTime={currentDateTime}
            city={locationData.city}
            state={locationData.state}
            country={locationData.country}
          />
          <WeatherInfo weather={weather} />
        </motion.div>
      ) : (
        <LoadingMessage>
          <Spinner />
          <p>Fetching weather data... Please wait.</p>
        </LoadingMessage>
      )}
    </WidgetContainer>
  );
};

export default WeatherWidget;
