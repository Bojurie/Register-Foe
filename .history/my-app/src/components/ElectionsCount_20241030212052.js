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
            <motion.div
              className="icon-container"
              initial={{ y: -10 }}
              animate={{ y: [0, -8, 0, -5, 0] }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <FaCalendarCheck className="elections-icon current-icon" />
            </motion.div>
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
            <motion.div
              className="icon-container"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <FaCalendarAlt className="elections-icon total-icon" />
            </motion.div>
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
