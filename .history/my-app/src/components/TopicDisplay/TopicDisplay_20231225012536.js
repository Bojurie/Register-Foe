import React from "react";

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
          <li key={topic.id || topic._id}>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <button onClick={() => handleLike(topic.id)}>Like</button>
            <button onClick={() => handleVote(topic.id)}>Vote</button>
            {isAdmin && (
              <button onClick={() => handleDelete(topic.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDisplay;