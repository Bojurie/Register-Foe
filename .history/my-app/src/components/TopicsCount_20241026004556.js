import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import { motion } from "framer-motion";
import "./TopicsCount.css";

const TopicsCount = ({ topics }) => {
  const [totalTopics, setTotalTopics] = useState(0); // State for the total topics count
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (!topics || topics.length === 0) {
      setError("No topics available.");
      setLoading(false);
      setTotalTopics(0);
      return;
    }

    setTotalTopics(topics.length); // Set total count based on topics array length
    setLoading(false);
    setError(null);
  }, [topics]);

  return (
    <motion.div
      className="topics-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p> // Show loading state
      ) : error ? (
        <p className="error-message">{error}</p> // Show error message if any
      ) : (
        <div className="topics-count-box">
          <FaBook className="topics-icon" />
          <motion.h2
            className="topics-count"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {totalTopics} Topics {/* Display the total number of topics */}
          </motion.h2>
        </div>
      )}
    </motion.div>
  );
};

export default TopicsCount;
