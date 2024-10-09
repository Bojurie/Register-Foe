import React from "react";
import { motion } from "framer-motion";
import { FaThumbsUp, FaThumbsDown, FaTrash, FaComments } from "react-icons/fa";
import "./TopicDisplay.css";

const TopicDisplay = ({
  topic,
  likesCount,
  dislikesCount,
  isAdmin,
  onLike,
  onDislike,
  onDelete,
  onComment,
  comments,
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
          onClick={onLike}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Like this topic"
        >
          <FaThumbsUp /> Like ({likesCount})
        </motion.button>
        <motion.button
          onClick={onDislike}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Dislike this topic"
        >
          <FaThumbsDown /> Dislike ({dislikesCount})
        </motion.button>
        {isAdmin && (
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
        <motion.button
          onClick={onComment}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="View comments"
        >
          <FaComments /> Comments ({comments.length})
        </motion.button>
      </div>
      {comments.length > 0 && (
        <div className="topic-comments">
          <h4>Comments:</h4>
          {comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p>
                <strong>{comment.user?.firstName}:</strong> {comment.text}
              </p>
              <p className="comment-date">{formatDate(comment.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TopicDisplay;
