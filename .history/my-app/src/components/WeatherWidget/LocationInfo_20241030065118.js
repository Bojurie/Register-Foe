import React from "react";
import { motion } from "framer-motion";
import "./LocationInfo.css";

const LocationInfo = ({ locationData }) => {
  return (
    <>
    <motion.div
      className="LocationInfo"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="CurrentTime" layout>
        <p>{locationData.time}</p>
      </motion.div>
      <motion.div className="Location" layout>
        <p>{`${locationData.city}, ${locationData.state}, ${locationData.country}`}</p>
      </motion.div>
      <motion.p className="Date" layout>
        {locationData.date}
      </motion.p>
    </motion.div>
        <div className="WeatherInfo">
      <motion.img
        src={weatherIcon}
        alt="Weather Icon"
        className="WeatherIcon"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.h2
        className="Temperature"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {`${temperature}°F`}
      </motion.h2>
      <motion.p
        className="Description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {description}
      </motion.p>
    </div>
    </>
  );
};

export default LocationInfo;
