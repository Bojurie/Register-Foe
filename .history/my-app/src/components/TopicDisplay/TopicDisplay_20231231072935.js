import React from "react";
import { FaThumbsUp, FaVoteYea, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import "./TopicDisplay.css"; // Assuming you have a CSS file for styling

const TopicDisplay = ({ topic, isAdmin, onLike, onVote, onDelete }) => {
  return (
    <div className="topic-display">
      <ul>
        <li className="topic-item">
          <h3>{topic.title}</h3>
          <p>{topic.description}</p>
          <FaThumbsUp onClick={() => onLike(topic._id)} className="icon" />
          <FaVoteYea onClick={() => onVote(topic._id)} className="icon" />
          {isAdmin && (
            <FaTrash onClick={() => onDelete(topic._id)} className="icon" />
          )}
        </li>
      </ul>
    </div>
  );
};

export default TopicDisplay;