import React from "react";
import { motion } from "framer-motion";
import Topic from "../Topic/Topic";
import "./TopicWidget.css"; 

const TopicWidget = ({ topics }) => {
  if (!Array.isArray(topics) || topics.length === 0) {
    return <div>No topics available.</div>;
  }

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
    <motion.div className="TopicWidget-Wrapper" variants={containerVariants} initial="hidden" animate="visible">
      <h2>Topics to Vote</h2>
      <div className="TopicWidget">
        <div className="TopicsContainer">
          {topics.map((topic) => (
            <Topic key={topic._id} topic={topic} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TopicWidget;
