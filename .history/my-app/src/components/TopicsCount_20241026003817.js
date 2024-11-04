import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "./axiosInstance"; // Ensure axiosInstance is configured
import "./TopicsCount.css"; // Custom styling for the component
import { useAuth } from "./AuthContext/AuthContext";

const TopicsCount = () => {
  const [totalTopics, setTotalTopics] = useState(0); // Total number of topics
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
const [fetchTopicsByCompanyCode, user] = useAuth()
  // Function to fetch the total number of topics
  const fetchTotalTopics = async () => {
    try {
      const response = await fetchTopicsByCompanyCode.get(companyCode);
      if (response.status === 200) {
        setTotalTopics(response.data.totalTopics || 0); // Set total topics from response
        setError(null); // Clear any previous errors
      } else {
        setError("Failed to fetch topic count.");
      }
    } catch (err) {
      console.error("Error fetching topic count:", err);
      setError("An error occurred while fetching topic count.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // UseEffect to trigger topic fetch on mount
  useEffect(() => {
    setLoading(true);
    fetchTotalTopics();
  }, []); // Only run once on component mount

  return (
    <motion.div
      className="topics-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p> // Show loading text while fetching data
      ) : error ? (
        <p className="error-message">{error}</p> // Show error if any
      ) : (
        <div className="topics-count-box">
          <FaBook className="topics-icon" />
          <motion.h2
            className="total-topics"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {totalTopics} Topics
          </motion.h2>
        </div>
      )}
    </motion.div>
  );
};

export default TopicsCount;
