import React, { useState, useEffect } from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";

const Topic = ({ topic }) => {
  const handleLike = (topicId) => {
    console.log("Like topic:", topicId);
    // Add like logic
  };

  const handleVote = (topicId) => {
    console.log("Vote for topic:", topicId);
    // Add vote logic
  };

  const handleDelete = (topicId) => {
    console.log("Delete topic:", topicId);
    // Add delete logic
  };

  return (
    <TopicDisplay
      topic={topic}
      isAdmin={true} // Assuming isAdmin is determined somewhere
      onLike={handleLike}
      onVote={handleVote}
      onDelete={handleDelete}
    />
  );
};

export default Topic;
