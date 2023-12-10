import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
import SearchBar from "../SearchBar/SearchBar";
import { useAuth } from "../AuthContext/AuthContext"

// import * as THREE from "three"

const Dashboard = () => {
    const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [currentLocation, setCurrentLocation] = useState({});
  const [cubeRotation, setCubeRotation] = useState(0);

  const getUserLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const locationData = await reverseGeocode(latitude, longitude);
      return {
        city: locationData.city,
        state: locationData.state,
      };
    } catch (error) {
      console.error("Error getting user location:", error.message);
      return {
        city: "Unknown",
        state: "Unknown",
      };
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=$AIzaSyCzujcMgt2TgzNetiqPcFvteocc1MhKaf4`
    );
    const data = await response.json();

    if (data.length > 0) {
      const { name: city, state } = data[0];
      return { city, state };
    } else {
      return { city: "Unknown", state: "Unknown" };
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const location = await getUserLocation();
      setCurrentLocation(location);
    };

    setCurrentTime(
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })
    );

    fetchLocation();

    // Rotate the cube every second
    const interval = setInterval(() => {
      setCubeRotation((prevRotation) => prevRotation + Math.PI / 2);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1>Welcome, {user ? user.FirstName : "Guest"}!</h1>
      <p>Current Time: {currentTime}</p>
      <p>
        Current Location: {currentLocation.city || "Unknown"},{" "}
        {currentLocation.state || "Unknown"}
      </p>

      <WeatherWidget city={currentLocation.city} />
      <ElectionsWidget />
      <SearchBar />
      <motion.div
        style={{
          width: "100px",
          height: "100px",
          position: "relative",
        }}
      >
        <canvas id="cube-canvas" />
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            rotate: cubeRotation,
            originX: 0.5,
            originY: 0.5,
            width: "60px",
            height: "60px",
            backgroundColor: "#3498db",
          }}
        />
      </motion.div>

      {/* Logout Button */}
      <button onClick={logout}>Logout</button>
    </motion.div>
  );
};

export default Dashboard;
