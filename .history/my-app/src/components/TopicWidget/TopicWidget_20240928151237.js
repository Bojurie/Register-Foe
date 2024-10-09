import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topic from "../Topic/Topic";
import "./TopicWidget.css";

const TopicWidget = ({ topics }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Initially set to true to make it collapsed on load

  if (!Array.isArray(topics) || topics.length === 0) {
    return <div>No topics available.</div>;
  }

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

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

  return (
    <motion.div
      className={`TopicWidget-Wrapper ${isCollapsed ? "collapsed" : ""}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        Topics to Vote
      </h1>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="TopicWidget"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="TopicsContainer">
              {topics.map((topic) => (
                <Topic key={topic._id} topic={topic} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TopicWidget;
