import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider, useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentLocation, setCurrentLocation] = useState({
    city: "",
    state: "",
  });
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    // Fetch current time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    const timeIntervalId = setInterval(updateTime, 1000);

    // Fetch current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Fetch city and state using reverse geocoding (replace with your API)
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY`
          )
            .then((response) => response.json())
            .then((data) => {
              setCurrentLocation({
                city: data.name || "Unknown",
                state:
                  data.sys && data.sys.country ? data.sys.country : "Unknown",
              });
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
              setCurrentLocation({ city: "Unknown", state: "Unknown" });
            });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setCurrentLocation({ city: "Unknown", state: "Unknown" });
        }
      );
    }

    // Fetch current weather using OpenWeatherMap API (replace with your API)
    // Example API: https://openweathermap.org/current
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=New York&appid=YOUR_API_KEY"
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrentWeather(
          data.weather && data.weather.length > 0
            ? data.weather[0].description
            : "Unknown"
        );
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setCurrentWeather("Unknown");
      });

    return () => {
      clearInterval(timeIntervalId);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="Main">
      <AuthProvider>
        {isAuthenticated && (
          <Dashboard
            user={user}
            currentTime={currentTime}
            currentLocation={currentLocation}
            currentWeather={currentWeather}
          />
        )}
      </AuthProvider>
      {/* <ElectionList /> */}
    </div>
  );
};

export default Main;
