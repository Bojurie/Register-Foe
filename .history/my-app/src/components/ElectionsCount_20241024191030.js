import React, { useState, useEffect } from "react";
import { FaCalendarCheck, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "./axiosInstance"; // Assuming axiosInstance is configured properly
import "./ElectionsCount.css"; // Custom styling

const ElectionsCount = ({ companyCode }) => {
  const [totalElections, setTotalElections] = useState(0); // Total number of elections
  const [currentElections, setCurrentElections] = useState(0); // Current (ongoing) elections
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch the election counts
  const fetchElectionsData = async (companyCode) => {
    if (!companyCode) {
      setError("Company code is required to fetch elections.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(
        `/election/elections/byCompanyCode/${companyCode}`
      );
      if (response.status === 200 && response.data) {
        const { totalElections, currentElections } = response.data;
        setTotalElections(totalElections);
        setCurrentElections(currentElections);
        setError(null); // Clear any previous errors
      } else {
        setError("Failed to fetch election data.");
      }
    } catch (error) {
      setError("Error fetching elections.");
    } finally {
      setLoading(false); // Disable loading
    }
  };

  // Fetch the election data when companyCode changes
  useEffect(() => {
    fetchElectionsData(companyCode);
  }, [companyCode]);

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
