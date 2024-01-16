import React from "react";
import { motion } from "framer-motion";
import { FaThumbsUp, FaThumbsDown, FaVoteYea, FaTrash } from "react-icons/fa";
import "./TopicDisplay.css";

const TopicDisplay = ({
  topic,
  likesCount,
  dislikesCount,
  votesCount,
  isAdmin,
  onLike,
  onDislike,
  onVote,
  onDelete,
}) => {
  // ...formatDate function...

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  return (
    <motion.div
      className="topic-display"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <div>
        <p>
          Start: {formatDate(topic.dateStart)} - End:{" "}
          {formatDate(topic.dateEnd)}
        </p>
      </div>
      <div className="topic-actions">
        <motion.button
          onClick={onLike}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaThumbsUp /> Like ({likesCount})
        </motion.button>
        <motion.button
          onClick={onDislike}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaThumbsDown /> Dislike ({dislikesCount})
        </motion.button>
        <motion.button
          onClick={onVote}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaVoteYea /> Vote ({votesCount})
        </motion.button>
        {isAdmin && (
          <motion.button
            onClick={onDelete}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaTrash /> Delete
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TopicDisplay;
