import React from "react";

const TopicDisplay = ({ topics }) => {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        {topics.map((topic, index) => (
          <li key={index}>
            {topic.title} - {topic.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDisplay;
