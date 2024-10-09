import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topic from "../Topic/Topic";
import "./TopicWidget.css";

const TopicWidget = ({ topics }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Initially collapsed on load

  if (!Array.isArray(topics) || topics.length === 0) {
    return <div>No topics available.</div>;
  }

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
  };

  return (
    <div className="TopicWidget-Wrapper">
      <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        Topics to Vote
      </h1>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="TopicWidget"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
          >
            <motion.div
              className="TopicsContainer"
              variants={containerVariants}
            >
              {topics.map((topic) => (
                <Topic key={topic._id} topic={topic} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicWidget;
