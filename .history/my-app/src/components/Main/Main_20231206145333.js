import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider, useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState({
    city: "",
    state: "",
  });
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    const fetchLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();

        setCurrentLocation({
          city: data.city || "Unknown",
          state: data.state || "Unknown",
        });
      } catch (error) {
        console.error("Error fetching location:", error);
        setCurrentLocation({ city: "Unknown", state: "Unknown" });
      }
    };

    // const fetchWeather = async () => {
    //   try {
    //     const response = await fetch("/api/current-weather?city=New York");
    //     const data = await response.json();

    //     setCurrentWeather(
    //       data.weather && data.weather.length > 0
    //         ? data.weather[0].description
    //         : "Unknown"
    //     );
    //   } catch (error) {
    //     console.error("Error fetching weather:", error);
    //     setCurrentWeather("Unknown");
    //   }
    // };
    // fetch("/api/current-weather?city=New York")
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     setCurrentWeather(
    //       data.weather && data.weather.length > 0
    //         ? data.weather[0].description
    //         : "Unknown"
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching weather:", error);
    //     setCurrentWeather("Unknown");
    //   });

    

    const timeIntervalId = setInterval(updateTime, 1000);

    fetchLocation();
    fetchWeather();

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
