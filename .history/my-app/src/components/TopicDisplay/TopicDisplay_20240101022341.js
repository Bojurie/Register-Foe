import React from "react";
import "./TopicDisplay.css"; // Assuming you have a CSS file for styling

import { FaThumbsUp, FaThumbsDown, FaVoteYea, FaTrash } from "react-icons/fa";

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
  return (
    <div className="topic-display">
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <div>
        <p>{topic.dateStart} {topic.dateEnd}</p>
      </div>
      <div className="topic-actions">
        <button onClick={onLike}>
          <FaThumbsUp /> Like ({likesCount})
        </button>
        <button onClick={onDislike}>
          <FaThumbsDown /> Dislike ({dislikesCount})
        </button>
        <button onClick={onVote}>
          <FaVoteYea /> Vote ({votesCount})
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