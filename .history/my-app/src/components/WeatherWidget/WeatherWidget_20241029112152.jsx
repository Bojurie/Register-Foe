import React, { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { useTheme } from "../StyledComponents";
import WeatherInfo from "./WeatherInfo";
import LocationInfo from "./LocationInfo";
import "./WeatherWidget.css";
import { mockWeatherData, mockLocationData } from "./mockWeatherData";

const WeatherWidget = () => {
  const { currentTheme, updateTheme } = useTheme();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState({});
  const [cityKey, setCityKey] = useState("");

  const randomCity = useCallback(() => {
    const cityKeys = Object.keys(mockLocationData);
    const randomKey = cityKeys[Math.floor(Math.random() * cityKeys.length)];
    setCityKey(randomKey);
  }, []);

  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  const fetchWeatherData = useCallback(() => {
    try {
      const weatherData = mockWeatherData.locations[cityKey];
      const locationData = mockLocationData[cityKey];
      if (!weatherData || !locationData)
        throw new Error("Location data not found.");

      const {
        current: { temp, weather },
        timezone,
      } = weatherData;
      const { description, icon } = weather[0];

      setWeather({
        temperature: temp,
        description,
        weatherIcon: icon,
      });
      updateCurrentDateTime(timezone);
    } catch (error) {
      setError(error.message);
      setWeather(null);
    }
  }, [cityKey]);

  useEffect(() => {
    randomCity();
  }, [randomCity]);

  useEffect(() => {
    if (cityKey) fetchWeatherData();
  }, [fetchWeatherData, cityKey]);

  useEffect(() => {
    if (weather) {
      const hour = new Date().getHours();
      updateTheme(weather.weatherIcon, hour);
    }
  }, [weather, updateTheme]);

  const location = mockLocationData[cityKey] || {};

  return (
    <div
      style={{ background: currentTheme.background, color: currentTheme.color }}
      className="WeatherWidget"
    >
      {error ? (
        <p className="Error">{error}</p>
      ) : weather ? (
        <motion.div
          className="WeatherWidget-Content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LocationInfo
            currentDateTime={currentDateTime}
            city={location.city}
          />
          <WeatherInfo weather={weather} />
        </motion.div>
      ) : (
        <div>
          <div className="LoadingSpinner"></div>
          <p>Fetching weather data... Please wait.</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
