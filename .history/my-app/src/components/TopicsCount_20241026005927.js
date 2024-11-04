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
    setTotalTopics(topics.length);
    setCurrentTopics(
      topics.filter((topic) => new Date(topic.endDate) > currentDate).length
    );

    setLoading(false);
  }, [topics]);

  // Motion variants for icon animation
  const iconVariants = {
    initial: { opacity: 0, scale: 0.5, rotate: 0 },
    animate: {
      opacity: 1,
      scale: 1.1,
      rotate: [0, 10, -10, 0], // Slight rotation effect
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
    whileHover: { scale: 1.2, color: "#0056b3" }, // Slightly enlarge and color change on hover
  };

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
          <div className="topics-info">
            <motion.div
              className="topics-icon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
            >
              <FaClipboardList />
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

          <div className="topics-info">
            <motion.div
              className="topics-icon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              whileHover="whileHover"
            >
              <FaClipboardCheck />
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
