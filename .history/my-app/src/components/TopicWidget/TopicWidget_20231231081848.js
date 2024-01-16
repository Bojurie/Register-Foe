import React from "react";
import Topic from "../Topic/Topic";

const TopicWidget = ({ topics }) => {
  if (topics.length === 0) {
    console.log("Topics in Widget:", topics); // Debugging line
  }

  return (
    <div>
      <div>
        <h2>Topics to vote</h2>
      </div>
      {topics.map((topic) => (
        <Topic
          key={topic._id}
          topic={topic}
          dateStart={dateStart}
          dateEnd={dateEnd}
          description={description}
        />
      ))}
    </div>
  );
};

export default TopicWidget;
