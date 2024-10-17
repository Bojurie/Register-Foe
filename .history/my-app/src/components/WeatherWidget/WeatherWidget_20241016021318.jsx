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
  const API_KEY = process.env.OPENWEATHER_API_KEY || "YOUR_API_KEY_HERE"; // Ensure correct API key is used

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    try {
      const { lat, lon } = locationData;

      // Logging the API key and location data for debugging
      console.log("Using API Key:", API_KEY);
      console.log("Location Data:", locationData);

      // Validate the API key and location data
      if (!API_KEY) {
        throw new Error("Missing API key");
      }
      if (!lat || !lon) {
        throw new Error("Missing latitude or longitude in location data");
      }

      // Fetch weather data from the API
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

      // Log the full response to inspect
      console.log("Weather API Response:", response);

      // Destructure the data from the API response
      const { temp, weather: weatherInfo } = response.data.current;
      const { description, icon } = weatherInfo[0];

      // Update the weather state with the fetched data
      setWeather({
        temperature: temp,
        description,
        weatherIcon: icon,
      });

      // Update the date and time
      updateCurrentDateTime(locationData.timeZone);
    } catch (error) {
      // Log the error details and display the error message to the user
      console.error("Error fetching weather data:", error);
      setError("Could not fetch weather data. Please try again later.");
    }
  };

  // Function to update the current date and time based on the user's timezone
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

  // Function to select the appropriate weather icon based on the weather code
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

  // useEffect hook to trigger the weather data fetch when the component mounts or locationData changes
  useEffect(() => {
    if (!locationData || !API_KEY) {
      setError("Location data or API key is missing.");
    } else {
      fetchWeatherData();
    }
  }, [locationData]);

  // Render the weather widget or an error/loading state
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
