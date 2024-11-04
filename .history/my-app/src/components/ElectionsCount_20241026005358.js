import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import "./ElectionsCount.css";

const ElectionsCount = ({ elections }) => {
  const [totalElections, setTotalElections] = useState(0);
  const [currentElections, setCurrentElections] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(elections)) {
      setError("Invalid elections data.");
      setLoading(false);
      return;
    }

    const currentDate = new Date();
    setTotalElections(elections.length);
    setCurrentElections(
      elections.filter((election) => new Date(election.endDate) > currentDate)
        .length
    );

    setLoading(false);
  }, [elections]);

  return (
    <motion.div
      className="elections-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
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
