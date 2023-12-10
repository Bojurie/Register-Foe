import React, { useState, useEffect } from "react";
import './Dashboard.css'


const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Function to get the current time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    const timeInterval = setInterval(updateTime, 1000);

    // Get the current location using the geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setCurrentLocation("Location not available");
      }
    );

    // Clear the interval when the component is unmounted
    return () => clearInterval(timeInterval);
  }, []); // Empty dependency array ensures that this effect runs only once

  return (
    <div className="Dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <p>Current Time: {currentTime}</p>
      <p>Current Location: {currentLocation}</p>
    </div>
  );
};

export default Dashboard;
