import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherWidget = ({ locationData, setWeatherIcon }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!locationData) return;
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat: locationData.latitude,
              lon: locationData.longitude,
              units: "metric",
              appid: apiKey,
            },
          }
        );
        const weatherData = response.data;
        setWeather(weatherData);
        setWeatherIcon(weatherData.weather[0].icon);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchWeather();
  }, [locationData, setWeatherIcon]);

  if (!weather) return <p>Loading weather...</p>;

  const temp = weather?.main?.temp;
  const description = weather?.weather?.[0]?.description;

  return (
    <div className="WeatherWidget">
      <p>{description}</p>
      <h2>{Math.round(temp)}°C</h2>
    </div>
  );
};

export default WeatherWidget;
