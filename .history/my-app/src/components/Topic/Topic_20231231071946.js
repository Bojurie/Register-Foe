import React, { useState, useEffect } from "react";
import TopicDisplay from "../TopicDisplay/TopicDisplay";
import { GetTopicsByCode } from "../AuthAPI/AuthAPI"; // Corrected import

const Topic = ({topic,  companyCode }) => {
  const [topics, setTopics] = useState([]);
   const isAdmin = true; // Determine if the user is an admin

   const handleLike = (topicId) => {
     // Logic for liking a topic
   };

   const handleVote = (topicId) => {
     // Logic for voting on a topic
   };

   const handleDelete = (topicId) => {
     // Logic for deleting a topic
     // Update the topics state after deletion
   };
  return (
    <TopicDisplay
      topic={topic}
      isAdmin={isAdmin}
      onLike={handleLike}
      onVote={handleVote}
      onDelete={handleDelete}
    />
  );
};

export default Topic;
