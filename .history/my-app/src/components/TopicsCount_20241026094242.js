import React, { useState, useEffect } from "react";
import { FaClipboardList, FaClipboardCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import "./TopicsCount.css";

const TopicsCount = ({ topics }) => {
  const [totalTopics, setTotalTopics] = useState(0);
  const [currentTopics, setCurrentTopics] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(topics)) {
      setError("Invalid topics data.");
      setLoading(false);
      return;
    }

    const currentDate = new Date();

    // Filter active (current) topics
    const activeTopics = topics.filter((topic) => {
      const startDate = new Date(topic.dateStart);
      const endDate = new Date(topic.dateEnd);
      return startDate <= currentDate && endDate >= currentDate;
    });

    // Update counts
    setTotalTopics(topics.length);
    setCurrentTopics(activeTopics.length);
    setLoading(false);
  }, [topics]);

  return (
    <motion.div
      className="topics-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="topics-count-box">
          {/* Current Topics */}
          <div className="topics-info">
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
              <FaClipboardList className="topics-icon current-icon" />
            </motion.div>
            <motion.h2
              className="current-topics"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentTopics} Current Topics
            </motion.h2>
          </div>

          {/* Total Topics */}
          <div className="topics-info">
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
              <FaClipboardCheck className="topics-icon total-icon" />
            </motion.div>
            <motion.h2
              className="total-topics"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {totalTopics} Total Topics
            </motion.h2>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TopicsCount;