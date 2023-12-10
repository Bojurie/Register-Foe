import React, { useState, useEffect } from "react";
import Geocode from "react-geocode";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    // Function to update the current time
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    // Update the time every second
    const timeInterval = setInterval(updateTime, 1000);

    // Configure react-geocode with your Google Maps API key
    // Geocode.setApiKey(process.env.GEO_API_KEY);

    // Get the current location using geocoding
    Geocode.fromLatLng("YOUR_LATITUDE", "YOUR_LONGITUDE").then(
      (response) => {
        const city = response.results[0].address_components[3].long_name;
        const state = response.results[0].address_components[5].short_name;
        setCurrentLocation(`City: ${city}, State: ${state}`);
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
