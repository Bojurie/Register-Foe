import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topic from "../Topic/Topic";
import "./TopicWidget.css";

const TopicWidget = ({ topics = [] }) => {
  // Default to an empty array if topics is undefined or null
  const [isCollapsed, setIsCollapsed] = useState(true); // Initially collapsed on load

  if (!Array.isArray(topics) || topics.length === 0) {
    return <div>No topics available.</div>;
  }

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="TopicWidget-Wrapper">
      <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        {isCollapsed ? "Show Topics to Vote" : "Hide Topics to Vote"}
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
            <div className="TopicsContainer">
              {topics.map((topic) => (
                <Topic key={topic._id} topic={topic} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicWidget;
