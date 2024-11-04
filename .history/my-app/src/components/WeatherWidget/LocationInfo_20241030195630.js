import React from "react";
import { motion } from "framer-motion";
import "./LocationInfo.css";

const LocationInfo = ({ locationData, weather }) => {
  if (!weather) return <p className="Loading">Loading...</p>;

  // Log the entire weather object to verify the structure
  console.log("Weather data:", weather);

  // Safely extract data with optional chaining and default fallbacks
  const temp = weather?.current?.temp ?? "N/A";
  const description =
    weather?.current?.weather?.[0]?.description ?? "No description";
  const icon = weather?.current?.weather?.[0]?.icon ?? "01d"; // Default to a sunny icon

  return (
    <div className="LocationInfoContainer">
      <motion.div
        className="LocationInfo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="CurrentTime">{locationData.time}</p>
        <p className="Location">{`${locationData.city}, ${locationData.state}, ${locationData.country}`}</p>
        <img
          src={`http://openweathermap.org/img/wn/${icon}.png`}
          alt={description}
          className="WeatherIcon"
        />
        <h2 className="Temperature">{Math.round(temp)}°C</h2>
        <p className="Description">{description}</p>
      </motion.div>
    </div>
  );
};

export default LocationInfo;
