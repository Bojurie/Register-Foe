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
  const [currentDateTime, setCurrentDateTime] = useState({});

const fetchWeatherData = useCallback(async () => {
  const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY; // OpenWeatherMap API Key
  console.log("API Key:", apiKey); // Log the API key to verify it's correct
  const { latitude, longitude } = locationData;

  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${apiKey}&units=imperial`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Handle your weather data here
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
    });
}, [locationData]);


  const updateCurrentDateTime = (timeZone) => {
    const now = DateTime.now().setZone(timeZone || "UTC");
    setCurrentDateTime({
      date: now.toLocaleString(DateTime.DATE_HUGE),
      time: now.toLocaleString(DateTime.TIME_SIMPLE),
    });
  };

  useEffect(() => {
    if (locationData) fetchWeatherData();
  }, [fetchWeatherData, locationData]);

  useEffect(() => {
    if (weather) {
      const hour = new Date().getHours();
      updateTheme(weather.weatherIcon, hour);
    }
  }, [weather, updateTheme]);

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
