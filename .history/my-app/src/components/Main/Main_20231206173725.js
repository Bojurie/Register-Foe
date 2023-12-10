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

      if (!response.ok) {
        throw new Error(`Error fetching location: ${response.statusText}`);
      }

      const data = await response.json();

      setCurrentLocation({
        city: data.city || "Unknown",
        state: data.state || "Unknown",
      });
    } catch (error) {
      console.error(error);
      setCurrentLocation({ city: "Unknown", state: "Unknown" });
    }
  };


    const fetchWeather = async () => {
      try {
     const response = await fetch(
      //  `/api/current-weather?city=${encodeURIComponent("New York")}`
     );

    console.log("Weather API Response:", response);

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
