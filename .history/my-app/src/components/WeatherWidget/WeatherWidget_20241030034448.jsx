import React, { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState({});

  const fetchWeatherData = useCallback(async () => {
    if (!locationData) {
      setError("Location data is not available.");
      setLoading(false);
      return;
    }

    const apiKey = "ee1f18e031a37db352d8b316c5b3f7c2"; // OpenWeather API Key
    const { latitude, longitude } = locationData;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${apiKey}&units=imperial`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }

      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }, [locationData]);

  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  useEffect(() => {
    if (locationData) {
      fetchWeatherData();
    }
  }, [fetchWeatherData, locationData]);

  useEffect(() => {
    if (weather) {
      const hour = new Date().getHours();
      const weatherIcon = weather.current.weather[0].icon;
      updateTheme(weatherIcon, hour);
      updateCurrentDateTime(weather.timezone);
    }
  }, [weather, updateTheme]);

  return (
    <WidgetContainer theme={currentTheme}>
      {loading ? (
        <LoadingMessage>
          <Spinner />
          <p>Fetching weather data... Please wait.</p>
        </LoadingMessage>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
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
      )}
    </WidgetContainer>
  );
};

export default WeatherWidget;
