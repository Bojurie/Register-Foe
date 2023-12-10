import React, { useState, useEffect } from "react";
import './Dashboard.css'


const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    // Function to get the current time
    const getCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      setCurrentTime(`${hours}:${minutes < 10 ? "0" : ""}${minutes}`);
    };

    // Function to get the current location (example, you may need to use a library for accurate location)
    const getCurrentLocation = () => {
      // For simplicity, set a default location
      setCurrentLocation("New York, NY");
    };

    getCurrentTime();
    getCurrentLocation();
  }, []);

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>Current Time: {currentTime}</p>
      <p>Current Location: {currentLocation}</p>
    </div>
  );
};

export default Dashboard;
