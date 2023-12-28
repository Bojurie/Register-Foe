import React from "react";
import { FaThumbsUp, FaVoteYea, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

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
    <div>
      <h2>Topics</h2>
      <ul>
        {topics.map((topic) => (
          <motion.li
            key={topic.id || topic._id}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <span onClick={() => handleLike(topic.id)}>
              <FaThumbsUp /> Like
            </span>
            <span onClick={() => handleVote(topic.id)}>
              <FaVoteYea /> Vote
            </span>
            {isAdmin && (
              <span onClick={() => handleDelete(topic.id)}>
                <FaTrash /> Delete
              </span>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDisplay;