import React from "react";
import { FaThumbsUp, FaThumbsDown, FaVoteYea, FaTrash } from "react-icons/fa";
// import { motion } from "framer-motion";
import "./TopicDisplay.css"; // Assuming you have a CSS file for styling

const TopicDisplay = ({
  topic,
  isAdmin,
  onLike,
  onDislike,
  onVote,
  onDelete,
}) => {
  return (
    <div className="topic-display">
      <h3>{topic.title}</h3>
      <div>
        <p>
          {topic.dateStart} - {topic.dateEnd}
        </p>
      </div>
      <p>{topic.description}</p>

      <div className="topic-actions">
        <button onClick={onLike}>
          <FaThumbsUp /> Like ({topic.likesCount})
        </button>

        <button onClick={onDislike}>
          <FaThumbsDown /> Dislike ({topic.dislikesCount})
        </button>

        <button onClick={onVote}>
          <FaVoteYea /> Vote ({topic.votesCount})
        </button>

        {isAdmin && (
          <button onClick={onDelete}>
            <FaTrash /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TopicDisplay;