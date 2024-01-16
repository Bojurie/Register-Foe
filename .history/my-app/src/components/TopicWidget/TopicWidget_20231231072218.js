import React from "react";
import Topic from "../Topic/Topic";

const TopicWidget = ({ topics,  }) => {
  return (
    <div>
      <div>
        <h2>Topics to vote</h2>
      </div>
      {topics.map((topic) => (
        <Topic key={topic._id} topic={topic}  />
      ))}
    </div>
  );
};

export default TopicWidget;
