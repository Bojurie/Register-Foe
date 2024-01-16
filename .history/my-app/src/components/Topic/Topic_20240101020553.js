import React from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";

const Topic = ({ topic, dateStart, dateEnd, description,isAdmin }) => {
  // Handlers for like, dislike, vote, and delete
  const handleLike = () => {
    console.log("Like topic:", topic._id);
    // Implement like logic
  };

  const handleDislike = () => {
    console.log("Dislike topic:", topic._id);
    // Implement dislike logic
  };

  const handleVote = () => {
    console.log("Vote for topic:", topic._id);
    // Implement vote logic
  };

  const handleDelete = () => {
    if (isAdmin) {
      console.log("Delete topic:", topic._id);
      // Implement delete logic
    } else {
      console.log("Unauthorized attempt to delete");
    }
  };


  return (
    <TopicDisplay
      topic={topic}
      dateStart={dateStart}
      dateEnd={dateEnd}
      description={description}
      isAdmin={isAdmin}
      onLike={handleLike}
      onDislike={handleDislike}
      onVote={handleVote}
      onDelete={handleDelete}
    />
  );
};

export default Topic;
