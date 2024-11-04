// LocationInfo.js
import React from "react";
import { motion } from "framer-motion";
import "./LocationInfo.css";

const LocationInfo = ({ locationData, weather }) => {
  if (!weather) return <p className="Loading">Loading...</p>;

  // Safely access properties, and use default values if undefined
  const temp = weather?.current?.temp ?? "N/A";
  const description =
    weather?.current?.weather?.[0]?.description || "No description";
  const icon = weather?.current?.weather?.[0]?.icon || "01d";

  const time = locationData?.time ?? "Time not available";
  const city = locationData?.city ?? "City not available";
  const state = locationData?.state ?? "State not available";
  const country = locationData?.country ?? "Country not available";

  return (
    <div className="LocationInfoContainer">
      <motion.div
        className="LocationInfo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="CurrentTime">{time}</p>
        <p className="Location">{`${city}, ${state}, ${country}`}</p>
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
