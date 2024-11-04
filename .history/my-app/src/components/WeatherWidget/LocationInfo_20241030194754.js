import React from "react";
import { motion } from "framer-motion";
import "./LocationInfo.css";

const LocationInfo = ({ locationData, weather }) => {
  if (!weather) return <p className="Loading">Loading...</p>;

  // Extract required data from the weather response
  const {
    main: { temp },
    weather: [{ description, icon }],
  } = weather;

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