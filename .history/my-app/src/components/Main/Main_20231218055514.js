// Main.js
import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";
import useLocation from "../LocationFetcher/LocationFetcher";
import useWeather from "../WeatherFetcher/WeatherFetcher";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState({
    city: "",
    state: "",
    timeZone: "",
  });
  const [currentWeather, setCurrentWeather] = useState({ description: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLocation.timeZone) {
        const newTime = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: currentLocation.timeZone,
        }).format(new Date());
        setCurrentTime(newTime);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentLocation.timeZone]);

  const handleLocationSuccess = (locationData) => {
    setCurrentLocation({
      city: locationData.city || "Unknown",
      state: locationData.state || "Unknown",
      timeZone: locationData.timeZone || "UTC",
    });
  };

  const handleWeatherSuccess = (weatherData) => {
    setCurrentWeather({
      description: weatherData.weather[0]?.description || "Unknown",
    });
  };

  const handleFetchError = (error) => {
    console.error("Fetch Error:", error);
  };

  useLocation({ onSuccess: handleLocationSuccess, onError: handleFetchError });
  useWeather(currentLocation.city, handleWeatherSuccess, handleFetchError);

  return (
    isAuthenticated && (
      <div className="Main">
        <Dashboard
          user={user}
          currentTime={currentTime}
          currentLocation={currentLocation}
          currentWeather={currentWeather}
        />
      </div>
    )
  );
};

export default Main;
