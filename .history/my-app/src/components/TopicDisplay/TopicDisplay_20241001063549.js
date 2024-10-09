import React from "react";
import { motion } from "framer-motion";
import { FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
import "./TopicDisplay.css";

const TopicDisplay = ({
  topic,
  likesCount,
  dislikesCount,
  isAdmin,
  onLike,
  onDislike,
  onDelete,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
          onClick={() => onLike && onLike()} 
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Like this topic"
        >
          <FaThumbsUp /> Like ({likesCount})
        </motion.button>
        <motion.button
          onClick={() => onDislike && onDislike()} 
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Dislike this topic"
        >
          <FaThumbsDown /> Dislike ({dislikesCount})
        </motion.button>

        {isAdmin && onDelete && (
          <motion.button
            onClick={onDelete}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            aria-label="Delete this topic"
          >
            <FaTrash /> Delete
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TopicDisplay;
