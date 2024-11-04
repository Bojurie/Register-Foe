import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topic from "../Topic/Topic";
import "./TopicWidget.css";

const TopicWidget = ({ topics = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5 },
    },
  };



  return (
    <div className="TopicWidget-Wrapper">
      <div className="TopicWidget-Header sticky-header" onClick={toggleCollapse}>
        <h2>{isCollapsed ? "Show Topics to Vote" : "Hide Topics to Vote"}</h2>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="TopicWidget"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={contentVariants}
          >
            {topics.length > 0 ? (
              <div className="TopicsContainer">
                {topics.map((topic) => (
                  <Topic key={topic._id} topic={topic} />
                ))}
              </div>
            ) : (
              <div className="NoTopics">No topics available.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicWidget;
