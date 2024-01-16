import React from "react";
import { FaThumbsUp, FaVoteYea, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import "./TopicDisplay.css"; // Assuming you have a CSS file for styling

const iconVariants = {
  hover: { scale: 1.2 },
  tap: { scale: 0.8 },
};

const TopicDisplay = ({ topics, isAdmin, onLike, onVote, onDelete }) => {
  const handleLike = (topicId) => {
    onLike(topicId);
  };

  const handleVote = (topicId) => {
    onVote(topicId);
  };

  const handleDelete = (topicId) => {
    onDelete(topicId);
  };

  return (
    <div className="topic-display">
      <ul>
        {topics.map((topic) => (
          <motion.li
            key={topic.id || topic._id}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="topic-item"
          >
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <motion.span
              className="icon"
              onClick={() => handleLike(topic.id)}
              whileHover="hover"
              whileTap="tap"
              variants={iconVariants}
            >
              <FaThumbsUp /> Like
            </motion.span>
            <motion.span
              className="icon"
              onClick={() => handleVote(topic.id)}
              whileHover="hover"
              whileTap="tap"
              variants={iconVariants}
            >
              <FaVoteYea /> Vote
            </motion.span>
            {isAdmin && (
              <motion.span
                className="icon"
                onClick={() => handleDelete(topic.id)}
                whileHover="hover"
                whileTap="tap"
                variants={iconVariants}
              >
                <FaTrash /> Delete
              </motion.span>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDisplay;