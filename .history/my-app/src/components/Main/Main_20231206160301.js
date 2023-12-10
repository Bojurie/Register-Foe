import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider, useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState({
    city: "",
    state: "",
    error: null,
  });
  const [currentWeather, setCurrentWeather] = useState({
    description: "",
    error: null,
  });

  useEffect(() => {
    // Function to fetch current time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    // Function to fetch user's current location
    const fetchLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
        );

        // Check if the response status is ok
        if (!response.ok) {
          console.error("Error fetching location:", response.statusText);
          setCurrentLocation({
            city: "Unknown",
            state: "Unknown",
            error: `Error fetching location: ${response.statusText}`,
          });
          return;
        }

        const data = await response.json();

        // Check if the data is in the expected JSON format
        if (data && data.city && data.state) {
          setCurrentLocation({
            city: data.city,
            state: data.state,
            error: null,
          });
        } else {
          console.error("Invalid JSON format in location data:", data);
          setCurrentLocation({
            city: "Unknown",
            state: "Unknown",
            error: "Invalid JSON format in location data",
          });
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setCurrentLocation({
          city: "Unknown",
          state: "Unknown",
          error: "Error fetching location",
        });
      }
    };

    // Function to fetch current weather
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `/api/current-weather?city=${encodeURIComponent("New York")}`
        );

        // Check if the response status is ok
        if (!response.ok) {
          console.error("Error fetching weather:", response.statusText);
          setCurrentWeather("Unknown");
          return;
        }

        const data = await response.json();

        setCurrentWeather(
          data.weather && data.weather.length > 0
            ? data.weather[0].description
            : "Unknown"
        );
      } catch (error) {
        console.error("Error fetching weather:", error.message);
        setCurrentWeather("Unknown");
      }
    };

    // Set up intervals and fetch initial data
    const timeIntervalId = setInterval(updateTime, 1000);
    fetchLocation();
    fetchWeather();

    // Cleanup intervals on component unmount
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
    </div>
  );
};

export default Main;
