import React from "react";
import Topic from "../Topic/Topic";
import './TopicWidget.css'
const TopicWidget = ({ topics }) => {
  if (!Array.isArray(topics) || topics.length === 0) {
    return <div>No topics available.</div>;
  }

  return (
    <div className="TopicWidget">
      <h2>Topics to vote</h2>
      {topics.map((topic) => (
        <Topic key={topic._id} topic={topic} />
      ))}
    </div>
  );
};

export default TopicWidget;
