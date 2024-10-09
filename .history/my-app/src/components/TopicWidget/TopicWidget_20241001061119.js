// Updated Topic Widget Component
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Topic from "../Topic/Topic";
import "./TopicWidget.css";

const TopicWidget = ({ topics }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="TopicWidget-Wrapper">
      <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        {isCollapsed ? "Show Topics to Vote" : "Hide Topics to Vote"}
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
    </div>
  );
};

export default TopicWidget;
