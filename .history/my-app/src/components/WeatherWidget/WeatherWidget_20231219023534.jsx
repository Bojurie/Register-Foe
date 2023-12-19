import React, { useState, useEffect } from "react";
import axios from "axios";

const WeatherWidget = () => {
  const [weather, setWeather] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationResponse = await axios.get(
              `https://api.openweathermap.org/geo/2.5/reverse`,
              {
                params: {
                  lat: latitude,
                  lon: longitude,
                  appid: process.env.GEO_API_KEY,
                },
              }
            );

            const city = locationResponse.data[0].name;
            const weatherResponse = await axios.get(
              "https://api.openweathermap.org/data/2.5/weather",
              {
                params: {
                  q: city,
                  appid: process.env.GEO_API_KEY,
                  units: "metric",
                },
              }
            );

            setWeather({
              temperature: weatherResponse.data.main.temp,
              description: weatherResponse.data.weather[0].description,
            });

            const currentDate = new Date().toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: locationResponse.data[0].timezone,
            });
            setCurrentDate(currentDate);
          } catch (error) {
            setError("Error fetching weather data");
            console.error(error);
          }
        },
        (err) => {
          setError(err.message);
        }
      );
    };

    fetchLocationAndWeather();
  }, []);

  return (
    <div className="WeatherWidget">
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>
            Current Weather in your location: {weather.temperature}°C,{" "}
            {weather.description}
          </p>
          <p>Current Date and Time: {currentDate}</p>
        </>
      )}
    </div>
  );
};

export default WeatherWidget;
