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
  comments,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <div className="date-info">
        <p>
          <strong>Start:</strong> {formatDate(topic.dateStart)} -{" "}
          <strong>End:</strong> {formatDate(topic.dateEnd)}
        </p>
      </div>
      <div className="topic-actions">
        <motion.button
          onClick={onLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="like-button"
          aria-label="Like this topic"
        >
          <FaThumbsUp className="icon" /> Like ({likesCount})
        </motion.button>
        <motion.button
          onClick={onDislike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="dislike-button"
          aria-label="Dislike this topic"
        >
          <FaThumbsDown className="icon" /> Dislike ({dislikesCount})
        </motion.button>
        {isAdmin && (
          <motion.button
            onClick={onDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="delete-button"
            aria-label="Delete this topic"
          >
            <FaTrash className="icon" /> Delete
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="comments-button"
          aria-label="View comments"
        >
          <FaComments className="icon" /> Comments ({comments.length})
        </motion.button>
      </div>

      {comments.length > 0 && (
        <div className="topic-comments">
          <h4>Comments:</h4>
          {comments.map((comment) => (
            <div key={comment._id} className="comment-bubble">
              <span>{comment.user?.firstName || "Anonymous"}</span>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TopicDisplay;
