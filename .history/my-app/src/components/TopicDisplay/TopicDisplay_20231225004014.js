import React from "react";

const TopicDisplay = ({ topics }) => {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id || topic._id}>
            {" "}
            {/* Replace with unique identifier */}
            {topic.title} - {topic.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicDisplay;