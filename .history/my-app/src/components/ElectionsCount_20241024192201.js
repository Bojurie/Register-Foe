import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "./ElectionsCount.css"; // Custom styling

const ElectionsCount = ({ elections }) => {
  const [totalElections, setTotalElections] = useState(0); // Total number of elections
  const [currentElections, setCurrentElections] = useState(0); // Current (ongoing) elections
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (Array.isArray(elections)) {
      // Set total elections count
      setTotalElections(elections.length);

      // Calculate current elections (where endDate is in the future)
      const currentDate = new Date();
      const ongoingElections = elections.filter(
        (election) => new Date(election.endDate) > currentDate
      );
      setCurrentElections(ongoingElections.length);

      setLoading(false); // Disable loading spinner once data is ready
    } else {
      setError("Invalid elections data.");
      setLoading(false);
    }
  }, [elections]); // Recalculate when elections data changes

  return (
    <motion.div
      className="elections-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p> // Show loading text
      ) : error ? (
        <p className="error-message">{error}</p> // Show error message if any
      ) : (
        <div className="elections-count-box">
          <div className="elections-info">
            <FaCalendarCheck className="elections-icon" />
            <motion.h2
              className="current-elections"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentElections} Current Elections
            </motion.h2>
          </div>

          <div className="elections-info">
            <FaCalendarAlt className="elections-icon" />
            <motion.h2
              className="total-elections"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {totalElections} Total Elections
            </motion.h2>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ElectionsCount;
